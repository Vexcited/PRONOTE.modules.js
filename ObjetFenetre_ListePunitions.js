const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_ListePunitions extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe,
			this.evenementSurListe,
			_initialiserListe,
		);
	}
	setDonnees(aListeEleves) {
		this.listeEleves = aListeEleves;
		this.listePunitions = new ObjetListeElements();
		this.construireListePunitionsDesEleves(this.listeEleves);
		if (this.listePunitions.count() > 0) {
			this.afficher();
			GHtml.setDisplay(this.Nom + "_ContenuListe", true);
			this.getInstance(this.IdentListe).setDonnees(
				new DonneesListe_ListePunitions(this.listePunitions),
			);
		} else {
			this.fermer();
			this.callback.appel(-2);
		}
	}
	construireListePunitionsDesEleves(aListeEleves) {
		if (!!aListeEleves) {
			for (let i = 0; i < aListeEleves.count(); i++) {
				const lEleve = aListeEleves.get(i);
				if (lEleve.listePunitions) {
					for (let j = 0; j < lEleve.listePunitions.count(); j++) {
						const lPunition = lEleve.listePunitions.get(j);
						if (lPunition.existe()) {
							const lElement = new ObjetElement(
								lEleve.getLibelle(),
								lEleve.getNumero(),
							);
							lElement.indiceEleve = i;
							lElement.indicePunition = j;
							lElement.type = lPunition.naturePunition;
							lElement.listeMotifs = lPunition.listeMotifs;
							lElement.duree = lPunition.duree;
							lElement.programmeeLe = lPunition.programmeeLe;
							lElement.realiseeLe = lPunition.realiseeLe;
							this.listePunitions.addElement(lElement);
						}
					}
				}
			}
		}
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="table-contain full-size" id="' +
				this.Nom +
				'_ContenuListe">',
			'<div class="as-cell " id="' +
				this.getNomInstance(this.IdentListe) +
				'"></div></div>',
		);
		return T.join("");
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Suppression: {
				const lArticleSupprime = aParametres.article;
				if (!!lArticleSupprime) {
					const lEleve = this.listeEleves.get(lArticleSupprime.indiceEleve);
					lEleve.setEtat(EGenreEtat.Modification);
					const lPunitionSupprimee = lEleve.listePunitions.get(
						lArticleSupprime.indicePunition,
					);
					lPunitionSupprimee.setEtat(EGenreEtat.Suppression);
					this.callback.appel(
						0,
						EGenreEvenementListe.Suppression,
						lArticleSupprime.indiceEleve,
					);
				}
				break;
			}
		}
	}
}
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.libelle,
		titre: GTraductions.getValeur("Absence.ListeEleves"),
		taille: 175,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.type,
		titre: GTraductions.getValeur("Absence.ListeType"),
		taille: 150,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.motifs,
		titre: GTraductions.getValeur("Absence.ListeMotif"),
		taille: "100%",
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.dateProgrammation,
		titre: GTraductions.getValeur("Absence.ListeDateProgrammation"),
		taille: 100,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.dateRealisation,
		titre: GTraductions.getValeur("Absence.ListeDateRealisation"),
		taille: 100,
	});
	aInstance.setOptionsListe({ colonnes: lColonnes });
}
class DonneesListe_ListePunitions extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEdition: false, avecEvnt_Suppression: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListePunitions.colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_ListePunitions.colonnes.type: {
				const lType = [];
				if (!!aParams.article.type) {
					lType.push(aParams.article.type.getLibelle());
					if (!!aParams.article.duree) {
						lType.push(
							GDate.formatDureeEnMillisecondes(
								aParams.article.duree * 60 * 1000,
								" - " + "%xh%sh%mm",
							),
						);
					}
				}
				return lType.join("");
			}
			case DonneesListe_ListePunitions.colonnes.motifs:
				return aParams.article.listeMotifs.getTableauLibelles().join("<br>");
			case DonneesListe_ListePunitions.colonnes.dateProgrammation:
				return aParams.article.programmeeLe || "";
			case DonneesListe_ListePunitions.colonnes.dateRealisation:
				return aParams.article.realiseeLe || "";
		}
		return "";
	}
	getCouleurCellule() {
		return ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
DonneesListe_ListePunitions.colonnes = {
	libelle: "DLPunitions_libelle",
	type: "DLPunitions_type",
	motifs: "DLPunitions_motifs",
	dateProgrammation: "DLPunitions_dateProg",
	dateRealisation: "DLPunitions_dateRea",
};
module.exports = { ObjetFenetre_ListePunitions };
