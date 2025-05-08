exports.ObjetFenetre_EditionAbsencesNonReglees = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Cache_1 = require("Cache");
const ObjetFenetre_SelectionMotif_1 = require("ObjetFenetre_SelectionMotif");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireDuree_1 = require("UtilitaireDuree");
class ObjetFenetre_EditionAbsencesNonReglees extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 600,
			hauteur: 300,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this.avecEdition = true;
		this.optionAffichageListe = { avecLibelleDateSurPremiereColonne: false };
	}
	setAvecEdition(aAvecEdition) {
		this.avecEdition = aAvecEdition;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe.bind(this),
		);
		if (this.avecEdition) {
			this.identFenetreMotif = this.addFenetre(
				ObjetFenetre_SelectionMotif_1.ObjetFenetre_SelectionMotif,
				this._evenementFenetreSelectionMotif.bind(this),
			);
		}
	}
	setParametres(aParam) {
		const lColonnesCachees = [];
		if (!aParam.avecDuree) {
			lColonnesCachees.push(
				DonneesListe_EditionAbsencesNonReglees.colonnes.duree,
			);
		}
		if (!aParam.avecDureeAbsence) {
			lColonnesCachees.push(
				DonneesListe_EditionAbsencesNonReglees.colonnes.dureeAbsence,
			);
		}
		const lOptionsListe = { colonnesCachees: lColonnesCachees };
		this.getInstance(this.identListe).setOptionsListe(lOptionsListe);
		this.optionAffichageListe.avecLibelleDateSurPremiereColonne =
			aParam.avecLibelleDateSurPremiereColonne === true;
	}
	setDonnees(aListeAbsences) {
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_EditionAbsencesNonReglees(aListeAbsences, {
				avecEdition: this.avecEdition,
			}),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
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
		return T.join("");
	}
	_initialiserListe(aInstance) {
		const lThis = this;
		aInstance.controleur.getLibellePremiereColonne = function () {
			return lThis.optionAffichageListe.avecLibelleDateSurPremiereColonne
				? ObjetTraduction_1.GTraductions.getValeur("Date")
				: ObjetTraduction_1.GTraductions.getValeur("Periode");
		};
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_EditionAbsencesNonReglees.colonnes.datesPeriode,
			titre: {
				libelleHtml: '<span ie-html="getLibellePremiereColonne"></span>',
			},
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_EditionAbsencesNonReglees.colonnes.dureeAbsence,
			titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_EditionAbsencesNonReglees.colonnes.duree,
			titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_EditionAbsencesNonReglees.colonnes.motif,
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.motif"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_EditionAbsencesNonReglees.colonnes.reglee,
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.titres.RA"),
			taille: 30,
			hint: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.RegleeAdmin"),
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (this.avecEdition) {
					const lInstance = this.getInstance(this.identFenetreMotif);
					const lAbsence = this.getInstance(this.identListe)
						.getListeArticles()
						.get(aParametres.ligne);
					lInstance.setOptionsFenetre({
						callback: this._evenementFenetreSelectionMotif.bind(this, lAbsence),
					});
					lInstance.setDonnees(Cache_1.GCache.listeMotifsAbsenceEleve, true);
				}
				break;
		}
	}
	_evenementFenetreSelectionMotif(aAbsence, aGenreBouton, aMotif, aChecked) {
		if (aGenreBouton === 1) {
			aAbsence.motif = MethodesObjet_1.MethodesObjet.dupliquer(aMotif);
			aAbsence.reglee =
				aChecked && aMotif && (!aMotif.recevable || aMotif.reglementAuto);
			aAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aAbsence.motif.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
	}
}
exports.ObjetFenetre_EditionAbsencesNonReglees =
	ObjetFenetre_EditionAbsencesNonReglees;
class DonneesListe_EditionAbsencesNonReglees extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.estAvecEdition = aParam.avecEdition;
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecTri: false,
			editionApresSelection: false,
		});
	}
	avecEdition(aParams) {
		if (this.estAvecEdition) {
			return (
				aParams.idColonne ===
					DonneesListe_EditionAbsencesNonReglees.colonnes.motif ||
				aParams.idColonne ===
					DonneesListe_EditionAbsencesNonReglees.colonnes.reglee
			);
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (this.estAvecEdition) {
			return (
				aParams.idColonne ===
				DonneesListe_EditionAbsencesNonReglees.colonnes.motif
			);
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_EditionAbsencesNonReglees.colonnes.reglee:
				aParams.article.reglee = V;
				break;
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EditionAbsencesNonReglees.colonnes.datesPeriode:
				return aParams.article.strDates || "";
			case DonneesListe_EditionAbsencesNonReglees.colonnes.dureeAbsence: {
				const lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
					aParams.article.duree,
				);
				const lFormatMin = lDuree > 59 ? "%mm" : "%xm";
				return lDuree > 0
					? ObjetDate_1.GDate.formatDureeEnMillisecondes(
							lDuree * 60 * 1000,
							lDuree > 59 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
						)
					: "";
			}
			case DonneesListe_EditionAbsencesNonReglees.colonnes.duree:
				return aParams.article.strDuree || "";
			case DonneesListe_EditionAbsencesNonReglees.colonnes.motif: {
				const lMotif = aParams.article.motif;
				if (!lMotif || lMotif.nonConnu) {
					return "";
				}
				return (
					'<span style="' +
					ObjetStyle_1.GStyle.composeCouleurFond(lMotif.couleur) +
					'">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' +
					lMotif.getLibelle()
				);
			}
			case DonneesListe_EditionAbsencesNonReglees.colonnes.reglee:
				return !!aParams.article.reglee;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EditionAbsencesNonReglees.colonnes.motif:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_EditionAbsencesNonReglees.colonnes.reglee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
}
DonneesListe_EditionAbsencesNonReglees.colonnes = {
	datesPeriode: "DLEditionAbsNonReglees_periode",
	dureeAbsence: "DLEditionAbsNonReglees_dureeAbsence",
	duree: "DLEditionAbsNonReglees_duree",
	motif: "DLEditionAbsNonReglees_motif",
	reglee: "DLEditionAbsNonReglees_reglee",
};
