exports.ObjetRequetePageSaisieAbsences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_DemiJours_1 = require("Enumere_DemiJours");
const TypeOptionPublicationDefautPassageInf_1 = require("TypeOptionPublicationDefautPassageInf");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class ObjetRequetePageSaisieAbsences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.application = (0, AccessApp_1.getApp)();
		this.parametres = this.application.getObjetParametres();
	}
	lancerRequete(aParametres) {
		this.JSON = {
			Professeur: aParametres.professeur,
			Ressource: new ObjetElement_1.ObjetElement(
				"",
				aParametres.numeroRessource,
			),
			Date: aParametres.date,
		};
		if (aParametres.dateDecompte) {
			this.JSON.DateDecompte = aParametres.dateDecompte;
		}
		if (aParametres.genreDecompte) {
			this.JSON.GenreDecompte = aParametres.genreDecompte;
		}
		if (aParametres.placeDebut) {
			this.JSON.PlaceDebut = aParametres.placeDebut;
		}
		if (aParametres.placeFin) {
			this.JSON.PlaceFin = aParametres.placeFin;
		}
		if (aParametres.coursSortiePeda) {
			Object.assign(this.JSON, {
				sortiePeda: true,
				absencesLiees: aParametres.coursSortiePeda.absencesLiees
					? aParametres.coursSortiePeda.absencesLiees.setSerialisateurJSON({
							ignorerEtatsElements: true,
						})
					: null,
				place: aParametres.coursSortiePeda.place,
				duree: aParametres.coursSortiePeda.duree,
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		if (!this.JSONReponse.Message) {
			const LItemAucun = ObjetElement_1.ObjetElement.create({
				Libelle:
					"&lt;" + ObjetTraduction_1.GTraductions.getValeur("Aucun") + "&gt;",
				Numero: 0,
				Visible: false,
			});
			lListeEleves.addElement(LItemAucun);
		}
		const lPlaceGrilleDebut = this.JSONReponse.PlaceGrilleDebut;
		if (!!this.JSONReponse.ListeEleves) {
			this.JSONReponse.ListeEleves.parcourir((aEleve) => {
				aEleve.Visible = true;
				if (!!aEleve.ListeAbsences) {
					aEleve.ListeAbsences.parcourir((aAbsenceEleve) => {
						if (!aAbsenceEleve.PlaceDebut) {
							if ("DateDebut" in aAbsenceEleve && !!aAbsenceEleve.DateDebut) {
								aAbsenceEleve.PlaceDebut =
									ObjetDate_1.GDate.dateEnPlaceAnnuelle(
										aAbsenceEleve.DateDebut,
									);
							}
						}
						if (!aAbsenceEleve.PlaceFin) {
							if ("DateFin" in aAbsenceEleve && !!aAbsenceEleve.DateFin) {
								aAbsenceEleve.PlaceFin = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
									aAbsenceEleve.DateFin,
									true,
								);
							}
						}
						if (!aAbsenceEleve.listeMotifs) {
							aAbsenceEleve.listeMotifs =
								new ObjetListeElements_1.ObjetListeElements();
						}
					});
				}
				if (!!aEleve.ListeDispenses) {
					aEleve.ListeDispenses.parcourir((aDispenseEleve) => {
						if (!aDispenseEleve.Professeur) {
							aDispenseEleve.Professeur = new ObjetElement_1.ObjetElement();
						}
					});
				}
				if (!("devoirARendre" in aEleve)) {
					aEleve.devoirARendre = new ObjetElement_1.ObjetElement();
				}
				if (!aEleve.devoirARendre.demandeur) {
					aEleve.devoirARendre.demandeur = new ObjetElement_1.ObjetElement();
				}
				if (!aEleve.devoirARendre.programmation) {
					aEleve.devoirARendre.programmation =
						new ObjetElement_1.ObjetElement();
				}
				aEleve.ListeExclusionsTemporaires =
					new ObjetListeElements_1.ObjetListeElements();
				let LEltExclusionTemporaire = null;
				if (
					"estExcluDefinitivement" in aEleve &&
					!!aEleve.estExcluDefinitivement
				) {
					LEltExclusionTemporaire = new ObjetElement_1.ObjetElement();
					LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
					LEltExclusionTemporaire.PlaceFin =
						lPlaceGrilleDebut + this.parametres.PlacesParJour;
					aEleve.ListeExclusionsTemporaires.addElement(LEltExclusionTemporaire);
				}
				const lListeSanctions =
					"listeSanctions" in aEleve ? aEleve.listeSanctions : undefined;
				if (!!lListeSanctions && lListeSanctions.count() > 0) {
					LEltExclusionTemporaire = new ObjetElement_1.ObjetElement();
					if (lListeSanctions.count() === 2) {
						LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
						LEltExclusionTemporaire.PlaceFin =
							lPlaceGrilleDebut + this.parametres.PlacesParJour;
					} else {
						if (
							lListeSanctions.get(0).getGenre() ===
							Enumere_DemiJours_1.EGenreDemiJours.Matin
						) {
							LEltExclusionTemporaire.PlaceDebut = lPlaceGrilleDebut;
							LEltExclusionTemporaire.PlaceFin =
								lPlaceGrilleDebut + this.parametres.PlaceDemiJournee - 1;
						} else if (
							lListeSanctions.get(0).getGenre() ===
							Enumere_DemiJours_1.EGenreDemiJours.ApresMidi
						) {
							LEltExclusionTemporaire.PlaceDebut =
								lPlaceGrilleDebut + this.parametres.PlaceDemiJournee;
							LEltExclusionTemporaire.PlaceFin =
								lPlaceGrilleDebut + this.parametres.PlacesParJour;
						}
					}
					aEleve.ListeExclusionsTemporaires.addElement(LEltExclusionTemporaire);
				}
			});
			lListeEleves.add(this.JSONReponse.ListeEleves);
		}
		lListeEleves.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		lListeEleves.trier();
		const lListeElevesEnStage = this.JSONReponse.ListeElevesEnStage;
		if (lListeElevesEnStage) {
			lListeElevesEnStage.trier();
		}
		const lListeDates = new ObjetListeElements_1.ObjetListeElements();
		lListeDates.dateDecompte = ObjetElement_1.ObjetElement.create({
			Genre: this.JSONReponse.GenreDecompte,
			valeur: this.JSONReponse.DateDecompte,
		});
		lListeDates.add(this.JSONReponse.ListeDates);
		if (this.JSONReponse.listeDemandesDispense) {
			this.JSONReponse.listeDemandesDispense.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					if (D.eleve) {
						return D.eleve.getLibelle();
					}
				}),
			]);
			this.JSONReponse.listeDemandesDispense.trier();
		}
		const lData = {
			listeEleves: lListeEleves,
			listeClasses: this.JSONReponse.listeClasses,
			listeDates: lListeDates,
			listeTitreColonnes: this.JSONReponse.ListeColonnes,
			dureeRetard: this.JSONReponse.DureeRetard,
			calculAutoDureeRetard: this.JSONReponse.calculAutoDureeRetard,
			genreRepas: this.JSONReponse.GenreRepas,
			placeGrilleDebut: lPlaceGrilleDebut,
			avecSupprAutreAbs: this.JSONReponse.AvecSuppressionAutreAbsence,
			avecModifRetardVS: this.JSONReponse.avecModifRetardVS,
			placeDeb: this.JSONReponse.PlaceSaisieDebut,
			placeFin: this.JSONReponse.PlaceSaisieFin,
			listeElevesEnStage: lListeElevesEnStage,
			message: this.JSONReponse.Message,
			publierParDefautPassageInf:
				this.JSONReponse.publierParDefautPassageInf ===
				TypeOptionPublicationDefautPassageInf_1
					.TypeOptionPublicationDefautPassageInf.OPDPI_Publie,
			jsonReponse: this.JSONReponse,
		};
		this.callbackReussite.appel(lData);
	}
}
exports.ObjetRequetePageSaisieAbsences = ObjetRequetePageSaisieAbsences;
(function (ObjetRequetePageSaisieAbsences) {
	ObjetRequetePageSaisieAbsences.isObjetElementAbsence = (aElement) => {
		return aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence;
	};
	ObjetRequetePageSaisieAbsences.isObjetElementRetard = (aElement) => {
		return aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard;
	};
	ObjetRequetePageSaisieAbsences.isObjetElemenInfirmerie = (aElement) => {
		return (
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Infirmerie
		);
	};
	ObjetRequetePageSaisieAbsences.isObjetElementExclusion = (aElement) => {
		return (
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Exclusion
		);
	};
	ObjetRequetePageSaisieAbsences.isObjetElementObservationIndividuEleve = (
		aElement,
	) => {
		return (
			aElement.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
		);
	};
	ObjetRequetePageSaisieAbsences.isObjetElementRepasAPreparer = (aElement) => {
		return (
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.RepasAPreparer
		);
	};
})(
	ObjetRequetePageSaisieAbsences ||
		(exports.ObjetRequetePageSaisieAbsences = ObjetRequetePageSaisieAbsences =
			{}),
);
CollectionRequetes_1.Requetes.inscrire(
	"PageSaisieAbsences",
	ObjetRequetePageSaisieAbsences,
);
