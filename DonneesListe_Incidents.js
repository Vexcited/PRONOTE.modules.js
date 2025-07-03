exports.DonneesListe_Incidents = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeGenreStatutProtagonisteIncident_1 = require("TypeGenreStatutProtagonisteIncident");
const MethodesObjet_1 = require("MethodesObjet");
class DonneesListe_Incidents extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(
		aDonnees,
		aUniquementMesIncidents,
		aAvecSaisie,
		aUniquementNonRegle,
	) {
		super(aDonnees);
		this.uniquementMesIncidents = aUniquementMesIncidents;
		this.uniquementNonRegle = aUniquementNonRegle;
		this.avecSaisieVise = [
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace);
		this._avecSaisie = aAvecSaisie;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecEvnt_ApresSuppression: true,
			avecContenuTronque: true,
		});
	}
	setUniquementMesIncidents(aValue) {
		this.uniquementMesIncidents = aValue;
	}
	setUniquementNonRegle(aValue) {
		this.uniquementNonRegle = aValue;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.date:
				return aParams.article.avecEditDate;
			case DonneesListe_Incidents.colonnes.heure:
				return false;
			case DonneesListe_Incidents.colonnes.motifs:
				return aParams.article.avecEditMotifs;
			case DonneesListe_Incidents.colonnes.lieu:
				return aParams.article.avecEditLieu;
			case DonneesListe_Incidents.colonnes.details:
				return aParams.article.avecEditDescription;
			case DonneesListe_Incidents.colonnes.vise:
				return (
					(this.avecSaisieVise && !aParams.article.estRA) ||
					aParams.article.avecEditVise
				);
			case DonneesListe_Incidents.colonnes.regle:
				return aParams.article.avecEditRA;
			case DonneesListe_Incidents.colonnes.faitDeViolence:
				return aParams.article.avecEditFaitDeViolence;
		}
		return false;
	}
	autoriserChaineVideSurEdition(aParams) {
		return aParams.idColonne === DonneesListe_Incidents.colonnes.details;
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.heure:
				return aParams.article.avecEditHeure
					? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc
					: null;
		}
		return null;
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.suitesDonnees:
				return "ie-ellipsis";
		}
		return super.getClass(aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.motifs:
				return aParams.article.avecEditMotifs;
			case DonneesListe_Incidents.colonnes.lieu:
				return aParams.article.avecEditLieu;
		}
		return false;
	}
	avecEvenementApresEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.date:
				return aParams.article.avecEditDate;
			case DonneesListe_Incidents.colonnes.heure:
				return false;
			case DonneesListe_Incidents.colonnes.details:
				return aParams.article.avecEditDescription;
			case DonneesListe_Incidents.colonnes.vise:
				return this.avecSaisieVise && !aParams.article.estRA;
			case DonneesListe_Incidents.colonnes.regle:
				return aParams.article.avecEditRA;
		}
		return false;
	}
	getValeur(aParams) {
		const lArr = [];
		let lListe;
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.id:
				return aParams.article.id;
			case DonneesListe_Incidents.colonnes.date:
				return aParams.article.dateheure;
			case DonneesListe_Incidents.colonnes.heure:
				return this._avecSaisie && aParams.article.avecEditHeure
					? '<input type="time" ie-model="inputTime(\'' +
							aParams.article.getNumero() +
							"', " +
							aParams.article.Etat +
							')" class="browser-default" aria-label="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"incidents.heureIncident",
							) +
							'"/>'
					: ObjetDate_1.GDate.formatDate(
							aParams.article.dateheure,
							"%hh : %mm",
						);
			case DonneesListe_Incidents.colonnes.motifs:
				return aParams.article.listeMotifs.getTableauLibelles().join(", ");
			case DonneesListe_Incidents.colonnes.lieu:
				return aParams.article.lieu ? aParams.article.lieu.getLibelle() : "";
			case DonneesListe_Incidents.colonnes.details:
				return aParams.article.getLibelle();
			case DonneesListe_Incidents.colonnes.auteurs:
				lListe = aParams.article.protagonistes.getListeElements((aElement) => {
					return (
						aElement.Genre ===
							TypeGenreStatutProtagonisteIncident_1
								.TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
						aElement.existe()
					);
				});
				lListe.parcourir((aElement) => {
					if (aElement && aElement.protagoniste) {
						lArr.push(aElement.protagoniste.getLibelle());
					}
				});
				return lArr.join(", ");
			case DonneesListe_Incidents.colonnes.victimes:
				lListe = aParams.article.protagonistes.getListeElements((aElement) => {
					return (
						aElement.Genre ===
							TypeGenreStatutProtagonisteIncident_1
								.TypeGenreStatutProtagonisteIncident.GSP_Victime &&
						aElement.existe()
					);
				});
				lListe.parcourir((aElement) => {
					if (aElement && aElement.protagoniste) {
						lArr.push(aElement.protagoniste.getLibelle());
					}
				});
				return lArr.join(", ");
			case DonneesListe_Incidents.colonnes.temoins:
				lListe = aParams.article.protagonistes.getListeElements((aElement) => {
					return (
						aElement.Genre ===
							TypeGenreStatutProtagonisteIncident_1
								.TypeGenreStatutProtagonisteIncident.GSP_Temoin &&
						aElement.existe()
					);
				});
				lListe.parcourir((aElement) => {
					if (aElement && aElement.protagoniste) {
						lArr.push(aElement.protagoniste.getLibelle());
					}
				});
				return lArr.join(", ");
			case DonneesListe_Incidents.colonnes.vise:
				return aParams.article.estVise;
			case DonneesListe_Incidents.colonnes.regle:
				return aParams.article.estRA;
			case DonneesListe_Incidents.colonnes.faitDeViolence:
				return aParams.article.faitDeViolence;
			case DonneesListe_Incidents.colonnes.actionsEnvisagees:
				return !!aParams.article.actionsEnvisagees
					? aParams.article.actionsEnvisagees.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_Incidents.colonnes.gravite:
				return aParams.article.gravite + "/5";
			case DonneesListe_Incidents.colonnes.rapporteur:
				return aParams.article.rapporteur.getLibelle();
			case DonneesListe_Incidents.colonnes.suitesDonnees:
				return aParams.article.suitesDonnees;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.date:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_Incidents.colonnes.heure:
				return aParams.article && aParams.article.avecEditHeure
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_Incidents.colonnes.vise:
			case DonneesListe_Incidents.colonnes.regle:
			case DonneesListe_Incidents.colonnes.faitDeViolence:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.suitesDonnees:
				return aParams.article.hintReponsesApportes;
			default:
				return super.getTooltip(aParams);
		}
	}
	initialiserObjetGraphique(aParams, aInstance) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			null,
			null,
			null,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.dateheure);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Incidents.colonnes.date:
				if (
					MethodesObjet_1.MethodesObjet.isDate(V) &&
					ObjetDate_1.GDate.estDateValide(V)
				) {
					const lDate = new Date(
						V.getFullYear(),
						V.getMonth(),
						V.getDate(),
						aParams.article.dateheure.getHours(),
						aParams.article.dateheure.getMinutes(),
					);
					aParams.article.dateheure = lDate;
				}
				break;
			case DonneesListe_Incidents.colonnes.details:
				aParams.article.Libelle = V;
				break;
			case DonneesListe_Incidents.colonnes.vise:
				aParams.article.estVise = V;
				break;
			case DonneesListe_Incidents.colonnes.regle:
				aParams.article.estRA = V;
				break;
			case DonneesListe_Incidents.colonnes.faitDeViolence:
				aParams.article.faitDeViolence = V;
				break;
			default:
				break;
		}
	}
	getVisible(aArticle) {
		return (
			(!this.uniquementNonRegle || !aArticle.estRA) &&
			(!this.uniquementMesIncidents || aArticle.estRapporteur)
		);
	}
	avecSuppression(aParams) {
		return this._avecSaisie && aParams.article.estEditable;
	}
	getLibelleDraggable(aParams) {
		return ObjetTraduction_1.GTraductions.getValeur("incidents.IncidentDu", [
			ObjetDate_1.GDate.formatDate(aParams.article.dateheure, "%JJ/%MM/%AAAA"),
		]);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (this._avecSaisie) {
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
				this.avecSuppression(aParametres) && !aParametres.nonEditable,
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
}
exports.DonneesListe_Incidents = DonneesListe_Incidents;
(function (DonneesListe_Incidents) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "0";
		colonnes["heure"] = "1";
		colonnes["motifs"] = "2";
		colonnes["lieu"] = "3";
		colonnes["details"] = "4";
		colonnes["auteurs"] = "5";
		colonnes["victimes"] = "6";
		colonnes["temoins"] = "7";
		colonnes["vise"] = "8";
		colonnes["regle"] = "9";
		colonnes["faitDeViolence"] = "10";
		colonnes["actionsEnvisagees"] = "11";
		colonnes["rapporteur"] = "12";
		colonnes["gravite"] = "13";
		colonnes["id"] = "14";
		colonnes["suitesDonnees"] = "15";
	})(
		(colonnes =
			DonneesListe_Incidents.colonnes ||
			(DonneesListe_Incidents.colonnes = {})),
	);
})(
	DonneesListe_Incidents ||
		(exports.DonneesListe_Incidents = DonneesListe_Incidents = {}),
);
