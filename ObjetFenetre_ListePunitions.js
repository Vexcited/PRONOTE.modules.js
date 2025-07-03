exports.ObjetFenetre_ListePunitions = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ListePunitions extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this._initialiserListe,
		);
	}
	setDonnees(aListeEleves) {
		this.listeEleves = aListeEleves;
		this.listePunitions = new ObjetListeElements_1.ObjetListeElements();
		this.construireListePunitionsDesEleves(this.listeEleves);
		if (this.listePunitions.count() > 0) {
			this.afficher();
			ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ContenuListe", true);
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
				if ("listePunitions" in lEleve && lEleve.listePunitions) {
					for (let j = 0; j < lEleve.listePunitions.count(); j++) {
						const lPunition = lEleve.listePunitions.get(j);
						if (lPunition.existe()) {
							const lElement = ObjetElement_1.ObjetElement.create({
								Libelle: lEleve.getLibelle(),
								Numero: lEleve.getNumero(),
								indiceEleve: i,
								indicePunition: j,
								type: lPunition.naturePunition,
								listeMotifs: lPunition.listeMotifs,
								duree: lPunition.duree,
								programmeeLe: lPunition.programmeeLe,
								realiseeLe: lPunition.realiseeLe,
							});
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
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lArticleSupprime = aParametres.article;
				if (!!lArticleSupprime) {
					const lEleve = this.listeEleves.get(lArticleSupprime.indiceEleve);
					lEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					const lPunitionSupprimee = lEleve.listePunitions.get(
						lArticleSupprime.indicePunition,
					);
					lPunitionSupprimee.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					this.callback.appel(
						0,
						Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
						lArticleSupprime.indiceEleve,
					);
				}
				break;
			}
		}
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListePunitions.Colonnes.libelle,
			titre: ObjetTraduction_1.GTraductions.getValeur("Absence.ListeEleves"),
			taille: 175,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.Colonnes.type,
			titre: ObjetTraduction_1.GTraductions.getValeur("Absence.ListeType"),
			taille: 150,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.Colonnes.motifs,
			titre: ObjetTraduction_1.GTraductions.getValeur("Absence.ListeMotif"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.Colonnes.dateProgrammation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Absence.ListeDateProgrammation",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.Colonnes.dateRealisation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Absence.ListeDateRealisation",
			),
			taille: 100,
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
}
exports.ObjetFenetre_ListePunitions = ObjetFenetre_ListePunitions;
class DonneesListe_ListePunitions extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEdition: false, avecEvnt_Suppression: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListePunitions.Colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_ListePunitions.Colonnes.type: {
				const lType = [];
				if (!!aParams.article.type) {
					lType.push(aParams.article.type.getLibelle());
					if (!!aParams.article.duree) {
						lType.push(
							ObjetDate_1.GDate.formatDureeEnMillisecondes(
								aParams.article.duree * 60 * 1000,
								" - " + "%xh%sh%mm",
							),
						);
					}
				}
				return lType.join("");
			}
			case DonneesListe_ListePunitions.Colonnes.motifs:
				return aParams.article.listeMotifs.getTableauLibelles().join("<br>");
			case DonneesListe_ListePunitions.Colonnes.dateProgrammation:
				return aParams.article.programmeeLe || "";
			case DonneesListe_ListePunitions.Colonnes.dateRealisation:
				return aParams.article.realiseeLe || "";
		}
		return "";
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
(function (DonneesListe_ListePunitions) {
	let Colonnes;
	(function (Colonnes) {
		Colonnes["libelle"] = "DLPunitions_libelle";
		Colonnes["type"] = "DLPunitions_type";
		Colonnes["motifs"] = "DLPunitions_motifs";
		Colonnes["dateProgrammation"] = "DLPunitions_dateProg";
		Colonnes["dateRealisation"] = "DLPunitions_dateRea";
	})(
		(Colonnes =
			DonneesListe_ListePunitions.Colonnes ||
			(DonneesListe_ListePunitions.Colonnes = {})),
	);
})(DonneesListe_ListePunitions || (DonneesListe_ListePunitions = {}));
