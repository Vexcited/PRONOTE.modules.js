exports.ObjetMoteurAbsences = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TTypePreparerRepas_1 = require("TTypePreparerRepas");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const Enumere_EvenementSaisieAbsences_1 = require("Enumere_EvenementSaisieAbsences");
const TypeIconeFeuilleDAppel_1 = require("TypeIconeFeuilleDAppel");
const tag_1 = require("tag");
const ObjetFenetre_DemandeDispense_1 = require("ObjetFenetre_DemandeDispense");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequetePageSaisieAbsences_1 = require("ObjetRequetePageSaisieAbsences");
const AccessApp_1 = require("AccessApp");
class ObjetMoteurAbsences {
	constructor() {
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.Date = null;
		this.placeSaisieDebut = null;
		this.placeSaisieFin = null;
		this.numeroProf = null;
		this.listeEleves = null;
		this.listeColonnes = null;
		this.Cours = null;
		this.autorisations = {
			avecSaisieAbsence: null,
			avecSaisieRetard: null,
			avecSaisieDispense: null,
			saisieAbsenceOuverte: null,
			saisieHorsCours: null,
			suppressionAbsenceDeVS: null,
			suppressionRetardDeVS: null,
			jourConsultUniquement: false,
		};
		this.genreCommandeMenuContextVS = {
			aucun: -1,
			modifier: 0,
			supprimer: 1,
			creerMemo: 2,
			publierObservation: 3,
			supprimerEleveDuCours: 4,
			creerValorisation: 5,
			publierPunition: 6,
			gestionAPEleve: 7,
			modifierMotif: 8,
		};
	}
	setOptions(aParam) {
		$.extend(this, aParam);
	}
	getAbsence(AEleve, AGenreAbsence, APlace, aNumObs) {
		let lListe = "ListeAbsences";
		if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Dispense) {
			lListe = "ListeDispenses";
		} else if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Punition) {
			lListe = "listePunitions";
		}
		const N = AEleve[lListe].count();
		if (
			AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Observation &&
			aNumObs !== null &&
			aNumObs !== undefined
		) {
			AGenreAbsence =
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve;
		}
		for (let J = 0; J < N; J++) {
			const LAbsence = AEleve[lListe].get(J);
			if (LAbsence.existe() && LAbsence.getGenre() === AGenreAbsence) {
				switch (AGenreAbsence) {
					case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve: {
						if (LAbsence.observation.Numero === aNumObs) {
							return LAbsence;
						}
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.Infirmerie: {
						if (
							this.placeSaisieDebut <= LAbsence.PlaceDebut &&
							this.placeSaisieFin >= LAbsence.PlaceFin
						) {
							return LAbsence;
						}
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.Punition: {
						const lPunition = LAbsence;
						if (
							(APlace >= lPunition.PlaceDebut &&
								APlace <= lPunition.PlaceFin) ||
							(this.placeSaisieDebut <= lPunition.placeDemande &&
								this.placeSaisieFin >= lPunition.placeDemande)
						) {
							return LAbsence;
						}
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.RepasAPreparer: {
						if (
							LAbsence.type !== TTypePreparerRepas_1.TTypePreparerRepas.prNonDP
						) {
							return LAbsence;
						}
						break;
					}
					default: {
						if (APlace >= LAbsence.PlaceDebut && APlace <= LAbsence.PlaceFin) {
							return LAbsence;
						}
						break;
					}
				}
			}
		}
		return false;
	}
	creerAbsence(
		AEleve,
		AGenreAbsence,
		APlaceDebut,
		APlaceFin,
		ADuree,
		AOuverte,
		aTypeObservation,
		aListeMotifs,
	) {
		let LAbsence = null;
		if (APlaceFin >= APlaceDebut) {
			LAbsence = new ObjetElement_1.ObjetElement(
				null,
				null,
				parseInt(AGenreAbsence),
			);
			LAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			LAbsence.Professeur = new ObjetElement_1.ObjetElement(
				null,
				this.appSco.getEtatUtilisateur().Identification.getMembre().getNumero(),
				this.appSco.getEtatUtilisateur().Identification.getMembre().getGenre(),
			);
			LAbsence.PlaceDebut = APlaceDebut;
			LAbsence.PlaceFin =
				AGenreAbsence !== Enumere_Ressource_1.EGenreRessource.Retard
					? APlaceFin
					: APlaceDebut;
			let lDuree = ADuree;
			if (
				AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
				this.calculAutoDureeRetard
			) {
				const lDateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(APlaceDebut);
				const LDateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(APlaceFin, true);
				const lDateCourante = ObjetDate_1.GDate.getDateHeureCourante();
				if (lDateCourante >= lDateDebut && lDateCourante <= LDateFin) {
					lDuree = Math.ceil((lDateCourante - lDateDebut) / 1000 / 60);
				}
			}
			LAbsence.Duree = lDuree;
			if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie) {
				LAbsence.DateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(APlaceDebut);
				LAbsence.DateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
					APlaceFin,
					true,
				);
				LAbsence.Accompagnateur = new ObjetElement_1.ObjetElement();
				LAbsence.commentaire = "";
				LAbsence.AvecInfirmerie = true;
			}
			if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion) {
				LAbsence.listeMotifs = aListeMotifs;
				LAbsence.estPubliee = false;
				if (LAbsence.listeMotifs) {
					LAbsence.listeMotifs.parcourir((aMotif) => {
						if (aMotif.publication) {
							LAbsence.estPubliee = true;
							return false;
						}
					});
				}
			}
			if (
				AGenreAbsence ===
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
			) {
				const lTypeObservation = this.listeColonnes.getElementParNumeroEtGenre(
					aTypeObservation,
					Enumere_Ressource_1.EGenreRessource.Observation,
				);
				LAbsence.observation =
					MethodesObjet_1.MethodesObjet.dupliquer(lTypeObservation) ||
					new ObjetElement_1.ObjetElement(null, aTypeObservation);
				LAbsence.commentaire = "";
				const lObservation =
					this.listeColonnes.getElementParNumero(aTypeObservation);
				if (lObservation) {
					LAbsence.estPubliee = lObservation.publiable;
				}
			}
			if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Dispense) {
				LAbsence.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(APlaceDebut);
				LAbsence.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
					APlaceFin,
					true,
				);
				LAbsence.commentaire = "";
				LAbsence.presenceOblig =
					this.appSco.getObjetParametres().general.valeurDefautPresenceDispense;
				LAbsence.estSurCours = true;
				LAbsence.matiere = this.Cours.matiere;
			}
			if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Absence) {
				const lPlaceAnnuelleCourante = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
					new Date(),
				);
				LAbsence.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
				LAbsence.listeMotifs.addElement(new ObjetElement_1.ObjetElement("", 0));
				if (AOuverte !== null && AOuverte !== undefined) {
					if (AOuverte === true) {
						LAbsence.PlaceFin =
							LAbsence.PlaceDebut === lPlaceAnnuelleCourante
								? lPlaceAnnuelleCourante
								: lPlaceAnnuelleCourante - 1;
						LAbsence.EstOuverte =
							LAbsence.PlaceDebut !== lPlaceAnnuelleCourante;
					}
				} else {
					if (LAbsence.PlaceFin > AEleve.DernierePlace) {
						AEleve.DernierePlace = LAbsence.PlaceFin;
						if (LAbsence.PlaceDebut <= lPlaceAnnuelleCourante) {
							LAbsence.AvecDebutAbsencePostPlaceHeureCourante = false;
							LAbsence.EstOuverte = false;
						} else {
							LAbsence.AvecDebutAbsencePostPlaceHeureCourante = true;
						}
					}
				}
			}
			const lTris = [
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init("PlaceDebut"),
			];
			if (AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Dispense) {
				AEleve.ListeDispenses.addElement(LAbsence);
				AEleve.ListeDispenses.setTri(lTris);
				AEleve.ListeDispenses.trier();
			} else {
				AEleve.ListeAbsences.addElement(LAbsence);
				AEleve.ListeAbsences.setTri(lTris);
				AEleve.ListeAbsences.trier();
			}
		}
		return LAbsence;
	}
	avecSaisieMotif(aGenreAbsence, aAvecSaisieDuree) {
		if (
			!!aAvecSaisieDuree &&
			aGenreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
		) {
			return true;
		} else {
			return this.getDroitSaisieMotif(aGenreAbsence);
		}
	}
	getDroitSaisieMotif(aGenreAbsence) {
		switch (aGenreAbsence) {
			case Enumere_Ressource_1.EGenreRessource.Absence:
				return !!this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites
						.appelSaisirMotifJustifDAbsence,
				);
			case Enumere_Ressource_1.EGenreRessource.Retard:
				return !!this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
				);
			default:
				return false;
		}
	}
	surEvenementSaisieAbsence(aParam) {
		if (
			aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Observation
		) {
			aParam.genreAbsence =
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve;
		}
		aParam.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		const lEtat =
			aParam.typeSaisie === Enumere_Etat_1.EGenreEtat.Creation
				? Enumere_Etat_1.EGenreEtat.Creation
				: aParam.typeSaisie === Enumere_Etat_1.EGenreEtat.Suppression
					? Enumere_Etat_1.EGenreEtat.Suppression
					: aParam.typeSaisie === Enumere_Etat_1.EGenreEtat.Modification
						? Enumere_Etat_1.EGenreEtat.Modification
						: Enumere_Etat_1.EGenreEtat.Aucun;
		if (lEtat === Enumere_Etat_1.EGenreEtat.Creation) {
			if (this.avecSaisieMotif(aParam.genreAbsence, aParam.avecSaisieDuree)) {
				aParam.fonctionSurOuvrirListeMotif(aParam);
				return;
			}
			if (!aParam.eleve.ListeAbsences) {
				aParam.eleve.ListeAbsences =
					new ObjetListeElements_1.ObjetListeElements();
			}
			if (!aParam.eleve.ListeDispenses) {
				aParam.eleve.ListeDispenses =
					new ObjetListeElements_1.ObjetListeElements();
			}
			this.creerAbsence(
				aParam.eleve,
				aParam.genreAbsence,
				aParam.placeDebut,
				aParam.placeFin,
				aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
					? this.dureeRetard
					: null,
				null,
				aParam.typeObservation,
				aParam.listeMotifs,
			);
		} else {
			aParam.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			let lListe = "ListeAbsences";
			let LAbsence;
			if (
				aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Dispense
			) {
				lListe = "ListeDispenses";
			} else if (
				aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Punition
			) {
				lListe = "listePunitions";
			}
			if (lEtat === Enumere_Etat_1.EGenreEtat.Suppression) {
				const N = aParam.eleve[lListe].count();
				for (let J = 0; J < N; J++) {
					LAbsence = aParam.eleve[lListe].get(J);
					if (LAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
						if (
							(aParam.genreAbsence !==
								Enumere_Ressource_1.EGenreRessource
									.ObservationProfesseurEleve &&
								LAbsence.getGenre() === aParam.genreAbsence &&
								aParam.placeFin >= LAbsence.PlaceDebut &&
								aParam.placeDebut <= LAbsence.PlaceFin) ||
							(aParam.genreAbsence ===
								Enumere_Ressource_1.EGenreRessource
									.ObservationProfesseurEleve &&
								LAbsence.getGenre() === aParam.genreAbsence &&
								LAbsence.observation.Numero === aParam.typeObservation) ||
							(aParam.genreAbsence ===
								Enumere_Ressource_1.EGenreRessource.Punition &&
								aParam.placeFin >= LAbsence.placeDemande &&
								aParam.placeDebut <= LAbsence.placeDemande)
						) {
							if (
								(aParam.genreAbsence ===
									Enumere_Ressource_1.EGenreRessource.Absence ||
									aParam.genreAbsence ===
										Enumere_Ressource_1.EGenreRessource.Retard) &&
								(this.etatUtilSco.GenreEspace ===
									Enumere_Espace_1.EGenreEspace.Professeur ||
									this.etatUtilSco.GenreEspace ===
										Enumere_Espace_1.EGenreEspace.Mobile_Professeur)
							) {
								let lPeutSuppr = this.peutSupprimerLAbsence(LAbsence);
								if (lPeutSuppr.peutSupprimer === false) {
									this.appSco
										.getMessage()
										.afficher({
											type: lPeutSuppr.genreMsg,
											message: lPeutSuppr.strMsg,
										});
									aParam.fonctionApresPasPossible(aParam);
									return false;
								}
							}
							if (
								aParam.genreAbsence ===
								Enumere_Ressource_1.EGenreRessource.Absence
							) {
								if (
									this.etatUtilSco.GenreEspace ===
										Enumere_Espace_1.EGenreEspace.Professeur ||
									this.etatUtilSco.GenreEspace ===
										Enumere_Espace_1.EGenreEspace.Mobile_Professeur
								) {
									if (
										!LAbsence.EstOuverte &&
										!LAbsence.Professeur.existeNumero() &&
										!this.autorisations.suppressionAbsenceDeVS
									) {
										this.appSco
											.getMessage()
											.afficher({
												type: Enumere_BoiteMessage_1.EGenreBoiteMessage
													.Information,
												message: ObjetTraduction_1.GTraductions.getValeur(
													"AbsenceVS.msgPasAutorise",
												),
											});
										aParam.fonctionApresPasPossible(aParam);
										return false;
									}
								}
								if (
									aParam.placeDebut > LAbsence.PlaceDebut &&
									aParam.placeFin < LAbsence.PlaceFin
								) {
									this.creerAbsence(
										aParam.eleve,
										LAbsence.getGenre(),
										aParam.placeFin + 1,
										LAbsence.PlaceFin,
										null,
										LAbsence.EstOuverte,
									);
									LAbsence.EstOuverte = false;
								}
								if (aParam.placeFin === LAbsence.PlaceFin) {
									LAbsence.EstOuverte = false;
								}
								if (aParam.placeDebut > LAbsence.PlaceDebut) {
									LAbsence.PlaceFin = aParam.placeDebut - 1;
								}
								if (aParam.placeFin < LAbsence.PlaceFin) {
									LAbsence.PlaceDebut = aParam.placeFin + 1;
								}
								if (aParam.placeFin >= aParam.eleve.DernierePlace) {
									aParam.eleve.DernierePlace = 0;
								}
								LAbsence.setEtat(
									this.etatUtilSco.getGenreOnglet() ===
										Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi ||
										(aParam.placeDebut <= LAbsence.PlaceDebut &&
											aParam.placeFin >= LAbsence.PlaceFin)
										? Enumere_Etat_1.EGenreEtat.Suppression
										: Enumere_Etat_1.EGenreEtat.Modification,
								);
							} else {
								LAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							}
						}
					}
				}
			} else {
				if (
					aParam.genreAbsence ===
					Enumere_Ressource_1.EGenreRessource.RepasAPreparer
				) {
					LAbsence = aParam.eleve[lListe].getElementParNumeroEtGenre(
						null,
						aParam.genreAbsence,
					);
					if (LAbsence.type === TTypePreparerRepas_1.TTypePreparerRepas.prNon) {
						LAbsence.type = TTypePreparerRepas_1.TTypePreparerRepas.prOui;
					} else if (
						LAbsence.type === TTypePreparerRepas_1.TTypePreparerRepas.prOui
					) {
						LAbsence.type = TTypePreparerRepas_1.TTypePreparerRepas.prNon;
					}
					LAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
			}
		}
		aParam.fonctionApresModification();
	}
	calculTableauColonnesInactives(aNumEleve) {
		const lTabInactif = [];
		let lAbsence, lElementAbs;
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		if (this.autorisations.jourConsultUniquement) {
			this.listeColonnes.parcourir((aColonne) => {
				if (
					aColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation &&
					aColonne.avecARObservation
				) {
					lTabInactif.push({
						genre: Enumere_Ressource_1.EGenreRessource.Observation,
						numero: aColonne.getNumero(),
					});
				} else {
					lTabInactif.push(aColonne.Genre);
				}
			});
		} else {
			if (this.autorisations.avecSaisieAbsence !== true) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
			}
			if (this.autorisations.avecSaisieRetard !== true) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Retard);
			}
			if (this.autorisations.avecSaisieDispense !== true) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Dispense);
			}
			if (lEleve && lEleve.eleveAjouteAuCours) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
			}
			if (
				lEleve &&
				"estEnseignementALaMaison" in lEleve &&
				lEleve.estEnseignementALaMaison
			) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Dispense);
				const lDispenseALaMaison = this.aUneDispense(aNumEleve, true);
				const lElementDispenseMaison = this.listeEleves
					.getElementParNumero(aNumEleve)
					.ListeDispenses.get(lDispenseALaMaison);
				if (
					!!lElementDispenseMaison &&
					!!lElementDispenseMaison.estEnseignementALaMaison
				) {
					lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Infirmerie);
				}
				if (!!lElementDispenseMaison && !lElementDispenseMaison.presenceOblig) {
					if (!this.Cours || !this.Cours.estAvecLienVisio) {
						lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
					}
				}
			}
			if (this.Cours && this.Cours.estSortiePedagogique) {
				lTabInactif.push(
					Enumere_Ressource_1.EGenreRessource.Infirmerie,
					Enumere_Ressource_1.EGenreRessource.Exclusion,
					Enumere_Ressource_1.EGenreRessource.Dispense,
				);
			}
			for (let j = 0; j < this.listeColonnes.count(); j++) {
				const lColonne = this.listeColonnes.get(j);
				if (lEleve && lEleve.estDetache) {
					if (
						lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
						lColonne.avecARObservation
					) {
						lTabInactif.push({
							genre: Enumere_Ressource_1.EGenreRessource.Observation,
							numero: lColonne.getNumero(),
						});
					}
					lTabInactif.push(lColonne.Genre);
				} else {
					if (
						lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
						lColonne.avecARObservation
					) {
						if (
							this.aUneObservationVue(aNumEleve, lColonne.getNumero()) !== -1
						) {
							lTabInactif.push({
								genre: Enumere_Ressource_1.EGenreRessource.Observation,
								numero: lColonne.getNumero(),
							});
						}
					}
					if (
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Absence &&
						(this.etatUtilSco.GenreEspace ===
							Enumere_Espace_1.EGenreEspace.Professeur ||
							this.etatUtilSco.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Mobile_Professeur)
					) {
						lAbsence = this.aUneAbsence(
							aNumEleve,
							Enumere_Ressource_1.EGenreRessource.Absence,
						);
						if (lAbsence !== -1) {
							lElementAbs = this.listeEleves
								.getElementParNumero(aNumEleve)
								.ListeAbsences.get(lAbsence);
							if (!lElementAbs.EstOuverte) {
								if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
											.GIA_Administratif &&
									!this.autorisations.suppressionAbsenceDeVS
								) {
									lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
								} else if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
											.GIA_Personnel &&
									!this.autorisations.suppressionAbsenceDeVS
								) {
									lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
								} else if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
											.GIA_Professeur &&
									lElementAbs.Professeur.getNumero() !==
										this.etatUtilSco.Identification.getMembre().getNumero()
								) {
									lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
								}
							}
						}
					}
					if (
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Retard &&
						(this.etatUtilSco.GenreEspace ===
							Enumere_Espace_1.EGenreEspace.Professeur ||
							this.etatUtilSco.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Mobile_Professeur)
					) {
						lAbsence = this.aUneAbsence(
							aNumEleve,
							Enumere_Ressource_1.EGenreRessource.Retard,
						);
						if (lAbsence !== -1) {
							lElementAbs = this.listeEleves
								.getElementParNumero(aNumEleve)
								.ListeAbsences.get(lAbsence);
							if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
										.GIA_Administratif &&
								!this.autorisations.suppressionRetardDeVS
							) {
								lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Retard);
							} else if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
										.GIA_Personnel &&
								!this.autorisations.suppressionRetardDeVS
							) {
								lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Retard);
							} else if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
										.GIA_Professeur &&
								lElementAbs.Professeur.getNumero() !==
									this.etatUtilSco.Identification.getMembre().getNumero()
							) {
								lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Retard);
							}
						}
					}
					if (
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Absence &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lTabInactif.push(
							Enumere_Ressource_1.EGenreRessource.Retard,
							Enumere_Ressource_1.EGenreRessource.Infirmerie,
							Enumere_Ressource_1.EGenreRessource.Exclusion,
							Enumere_Ressource_1.EGenreRessource.Punition,
							Enumere_Ressource_1.EGenreRessource.Dispense,
						);
					} else if (
						((lColonne.Genre !==
							Enumere_Ressource_1.EGenreRessource.Observation &&
							lColonne.getGenre() !==
								Enumere_Ressource_1.EGenreRessource.Dispense &&
							lColonne.getGenre() !==
								Enumere_Ressource_1.EGenreRessource.RepasAPreparer) ||
							lColonne.genreObservation ===
								TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres) &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
					} else if (
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Dispense &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lAbsence = this.aUneAbsence(
							aNumEleve,
							Enumere_Ressource_1.EGenreRessource.Dispense,
						);
						lElementAbs = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeDispenses.get(lAbsence);
						if (!lElementAbs.presenceOblig) {
							lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
							if (
								(this.etatUtilSco.GenreEspace ===
									Enumere_Espace_1.EGenreEspace.Professeur ||
									this.etatUtilSco.GenreEspace ===
										Enumere_Espace_1.EGenreEspace.Mobile_Professeur) &&
								lElementAbs &&
								!lElementAbs.Professeur.existeNumero() &&
								lElementAbs.estSurCours
							) {
								lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Dispense);
							}
						}
						if (!lElementAbs.estSurCours) {
							lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Dispense);
						}
					}
					if (
						lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.RepasAPreparer &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lAbsence = this.aUneAbsence(aNumEleve, lColonne.Genre);
						lElementAbs = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeAbsences.get(lAbsence);
						if (
							lElementAbs.type ===
								TTypePreparerRepas_1.TTypePreparerRepas.prNonDP ||
							lElementAbs.modifiable === false
						) {
							lTabInactif.push(lColonne.Genre);
						}
					}
				}
			}
			if (this.Cours && this.Cours.estAppelVerrouille) {
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Absence);
				lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Retard);
			}
			if (
				!lTabInactif.includes(Enumere_Ressource_1.EGenreRessource.Infirmerie)
			) {
				lAbsence = this.aUneAbsence(
					aNumEleve,
					Enumere_Ressource_1.EGenreRessource.Infirmerie,
				);
				if (
					lAbsence !== -1 &&
					this.listeEleves
						.getElementParNumero(aNumEleve)
						.ListeAbsences.get(lAbsence).Actif === false
				) {
					lTabInactif.push(Enumere_Ressource_1.EGenreRessource.Infirmerie);
				}
			}
		}
		return lTabInactif;
	}
	composeIdCell(aNomObj, aNumeroEleve, aGenreAbs, aNumeroColonne, aGenreObs) {
		return (
			aNomObj +
			"_cel_" +
			aNumeroEleve +
			"_" +
			aGenreAbs +
			"_abs" +
			(aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation
				? "_" + aNumeroColonne + "_" + aGenreObs
				: "")
		);
	}
	clicCellule(event, aIsValidation, aIsMenuContext) {
		const lRegExp = new RegExp(
			`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)(?=_abs)`,
		);
		const lNumEleve = $(this)
			.children("div:first-child")
			.attr("id")
			.match(lRegExp)[1];
		const lGenreCol = parseInt(
			$(this).children("div:first-child").attr("id").match(lRegExp)[2],
		);
		event.data.aObjet.gestionAccessibiliteClicCellule(this, lGenreCol);
		$("#" + event.data.aObjet.getSelecteurLibelle(lNumEleve)).click();
		if (
			$(this).hasClass(event.data.aObjet.getClassCelluleInactive()) ||
			($(this).hasClass(event.data.aObjet.getClassCelluleInactiveVS()) &&
				((lGenreCol === Enumere_Ressource_1.EGenreRessource.Retard &&
					!event.data.aObjet.options.suppressionRetardDeVS) ||
					!event.data.aObjet.options.suppressionAbsenceDeVS))
		) {
			return false;
		}
		let lNumAbs = null,
			lNumObs = null,
			lTypeObs = null;
		if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
			lNumObs = $(this)
				.children("div:first-child")
				.attr("id")
				.match(
					new RegExp(`abs_${ObjetElement_1.ObjetElement.regexCaptureNumero}`),
				)[1];
			lTypeObs = parseInt(
				$(this)
					.children("div:first-child")
					.attr("id")
					.match(/_([0-9]+)$/)[1],
			);
		}
		let lTypeSaisie = Enumere_Etat_1.EGenreEtat.Creation;
		if ($(this).children("div:first-child").html() !== "") {
			lTypeSaisie = Enumere_Etat_1.EGenreEtat.Suppression;
		}
		if (lGenreCol === Enumere_Ressource_1.EGenreRessource.RepasAPreparer) {
			lTypeSaisie = Enumere_Etat_1.EGenreEtat.Modification;
		}
		if (
			!aIsValidation &&
			((lTypeSaisie === Enumere_Etat_1.EGenreEtat.Suppression &&
				lGenreCol !== Enumere_Ressource_1.EGenreRessource.Absence &&
				lGenreCol !== Enumere_Ressource_1.EGenreRessource.Retard &&
				lTypeObs !==
					TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_ObservationParent &&
				lTypeObs !==
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement &&
				lGenreCol !== Enumere_Ressource_1.EGenreRessource.Punition) ||
				(aIsMenuContext &&
					(lGenreCol === Enumere_Ressource_1.EGenreRessource.Punition ||
						lTypeObs ===
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent ||
						lTypeObs ===
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_Encouragement)) ||
				$(this).hasClass(event.data.aObjet.getClassCelluleDispense()))
		) {
			lNumAbs = event.data.aObjet.moteur.aUneAbsence(
				lNumEleve,
				lGenreCol,
				lNumObs,
			);
			let lAUnCommentaire = false;
			let lAbsence;
			if (
				lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
				$(this).hasClass(event.data.aObjet.getClassCelluleDispense())
			) {
				lAUnCommentaire =
					lGenreCol === Enumere_Ressource_1.EGenreRessource.Absence;
			} else if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Punition) {
				lAbsence = event.data.aObjet.listeEleves
					.getElementParNumero(lNumEleve)
					.listePunitions.get(lNumAbs);
				lAUnCommentaire = !!(
					(lAbsence.commentaire && lAbsence.commentaire !== "") ||
					(lAbsence.circonstance && lAbsence.circonstance !== "")
				);
			} else {
				lAbsence = event.data.aObjet.listeEleves
					.getElementParNumero(lNumEleve)
					[
						lGenreCol !== Enumere_Ressource_1.EGenreRessource.Dispense
							? "ListeAbsences"
							: "ListeDispenses"
					].get(lNumAbs);
				if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Exclusion) {
					lAUnCommentaire = !!(
						(lAbsence.commentaire && lAbsence.commentaire !== "") ||
						(lAbsence.circonstance && lAbsence.circonstance !== "")
					);
				} else {
					lAUnCommentaire = !!(
						lAbsence &&
						lAbsence.commentaire &&
						lAbsence.commentaire !== ""
					);
				}
			}
			if (lAUnCommentaire) {
				const lEleve =
					event.data.aObjet.listeEleves.getElementParNumero(lNumEleve);
				let lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.msgContenu",
				);
				if (
					lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
					$(this).hasClass(event.data.aObjet.getClassCelluleDispense())
				) {
					lMessage = lEleve.messageDispense;
				} else if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Punition) {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InfosPunitionPerdues",
					);
				} else if (
					lGenreCol === Enumere_Ressource_1.EGenreRessource.Exclusion
				) {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InfosExclusionPerdues",
					);
				} else if (
					lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation
				) {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.CommentaireObsPerdu",
					);
				} else if (
					lGenreCol === Enumere_Ressource_1.EGenreRessource.Infirmerie
				) {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.CommentaireInfPerdu",
					);
				} else if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Dispense) {
					lMessage = `${lAbsence.avecDocuments ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.DispenseAvecCommPJ") : ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.DispenseAvecComm")} ${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ConfimationSuppression")}`;
				}
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMessage,
						callback: (aAccepte) => {
							if (!aAccepte) {
								$(this).trigger("click", [true, aIsMenuContext]);
							}
						},
					});
				return true;
			} else if (
				lGenreCol === Enumere_Ressource_1.EGenreRessource.Dispense &&
				lAbsence &&
				lAbsence.avecDocuments
			) {
				const lMessage = `${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.DispenseAvecPJ")}<br />${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ConfimationSuppression")}`;
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMessage,
						callback: (aAccepte) => {
							if (!aAccepte) {
								$(this).trigger("click", [true, aIsMenuContext]);
							}
						},
					});
				return true;
			}
		}
		switch (lGenreCol) {
			case Enumere_Ressource_1.EGenreRessource.Observation:
			case Enumere_Ressource_1.EGenreRessource.Absence:
			case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
				if (
					lTypeObs ===
						TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent ||
					lTypeObs ===
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement
				) {
					if (lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation) {
						event.data.aObjet.callback.appel(
							Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
								.ActionSurAbsence,
							{
								typeSaisie: lTypeSaisie,
								typeAbsence: lGenreCol,
								typeObservation: lNumObs,
								numeroEleve: event.data.aObjet.numeroEleveSelectionne,
								placeDebut: event.data.aObjet.placeSaisieDebut,
								placeFin: event.data.aObjet.placeSaisieFin,
							},
						);
					}
					if (
						!(
							aIsMenuContext &&
							lTypeSaisie === Enumere_Etat_1.EGenreEtat.Suppression
						)
					) {
						event.data.aObjet.ouvrirZoneTexte(
							lNumEleve,
							lGenreCol,
							lNumObs,
							lTypeObs,
							lTypeSaisie,
						);
						break;
					}
				}
				event.data.aObjet.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.ActionSurAbsence,
					{
						typeSaisie: lTypeSaisie,
						typeAbsence: lGenreCol,
						typeObservation: lNumObs,
						numeroEleve: event.data.aObjet.numeroEleveSelectionne,
						placeDebut: event.data.aObjet.placeSaisieDebut,
						placeFin: event.data.aObjet.placeSaisieFin,
					},
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Dispense: {
				const lAbsence = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
					null,
					true,
				);
				const lElementAbsence =
					lAbsence > -1
						? event.data.aObjet.moteur.listeEleves
								.getElementParNumero(lNumEleve)
								.ListeDispenses.get(lAbsence)
						: false;
				const lDemandeDispense =
					event.data.aObjet.moteur.getDemandeDeDispense(lNumEleve);
				const lDemandePasRefusee =
					lDemandeDispense && !lDemandeDispense.estRefusee;
				const lDemandeRefuseeEtAnnulable =
					lDemandeDispense &&
					lDemandeDispense.estRefusee &&
					lDemandeDispense.estRefuseeAnnulable;
				if (lDemandePasRefusee || lDemandeRefuseeEtAnnulable) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.DemandesDispenseEleve,
						{
							typeSaisie: lTypeSaisie,
							typeAbsence: lGenreCol,
							typeObservation: lNumObs,
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
						},
					);
					return;
				}
				if (
					lDemandeDispense &&
					lDemandeDispense.estRefusee &&
					!lDemandeDispense.estRefuseeAnnulable &&
					!lElementAbsence
				) {
					lTypeSaisie = Enumere_Etat_1.EGenreEtat.Creation;
				}
				event.data.aObjet.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.ActionSurAbsence,
					{
						typeSaisie: lTypeSaisie,
						typeAbsence: lGenreCol,
						typeObservation: lNumObs,
						numeroEleve: event.data.aObjet.numeroEleveSelectionne,
						placeDebut: event.data.aObjet.placeSaisieDebut,
						placeFin: event.data.aObjet.placeSaisieFin,
					},
				);
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				if (lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.Infirmerie,
						{
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
							place: event.data.aObjet.placeSaisieDebut,
							placeDebut: event.data.aObjet.placeSaisieDebut,
							placeFin: event.data.aObjet.placeSaisieFin,
						},
					);
				} else {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.ActionSurAbsence,
						{
							typeSaisie: lTypeSaisie,
							typeAbsence: lGenreCol,
							typeObservation: lNumObs,
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
							placeDebut: event.data.aObjet.placeSaisieDebut,
							placeFin: event.data.aObjet.placeSaisieFin,
						},
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Punition:
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				lNumAbs = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
					lNumObs,
				);
				if (lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.PunitionSaisie,
						{ genreAbsence: lGenreCol },
					);
				} else if (
					lGenreCol === Enumere_Ressource_1.EGenreRessource.Exclusion
				) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.ActionSurAbsence,
						{
							typeSaisie: lTypeSaisie,
							typeAbsence: lGenreCol,
							typeObservation: lNumObs,
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
							placeDebut: event.data.aObjet.placeSaisieDebut,
							placeFin: event.data.aObjet.placeSaisieFin,
						},
					);
				} else if (!aIsMenuContext) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.PunitionSaisie,
						{
							genreAbsence: lGenreCol,
							numeroPunition: lNumAbs * 2 + 1,
							modification: true,
						},
					);
				} else {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.PunitionSuppression,
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				if (
					lTypeSaisie === Enumere_Etat_1.EGenreEtat.Creation ||
					aIsMenuContext
				) {
					event.data.aObjet.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.ActionSurAbsence,
						{
							typeSaisie: lTypeSaisie,
							typeAbsence: lGenreCol,
							typeObservation: lNumObs,
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
							placeDebut: event.data.aObjet.placeSaisieDebut,
							placeFin: event.data.aObjet.placeSaisieFin,
						},
					);
				}
				if (!aIsMenuContext) {
					event.data.aObjet.ouvrirZoneTexte(
						lNumEleve,
						lGenreCol,
						lNumObs,
						lTypeObs,
						lTypeSaisie,
					);
				}
				break;
			default:
				break;
		}
	}
	calculerNbElevePresent() {
		let lNbEleves = this.listeEleves.count();
		let lNbElevesPresents = lNbEleves;
		let lAbsence;
		for (let i = 0; i < lNbEleves; i++) {
			let lEleve = this.listeEleves.get(i);
			let lContinuer = true;
			if (
				lEleve.Numero === 0 ||
				lEleve.estExclu ||
				lEleve.estSorti ||
				lEleve.sortiePeda ||
				lEleve.estDetache
			) {
				if (lEleve.Numero === 0) {
					lNbEleves -= 1;
				}
				lNbElevesPresents -= 1;
				lContinuer = false;
			}
			for (let j = 0; lContinuer && j < lEleve.ListeAbsences.count(); j++) {
				lAbsence = lEleve.ListeAbsences.get(j);
				if (
					lAbsence.existe() &&
					(lAbsence.Genre === Enumere_Ressource_1.EGenreRessource.Absence ||
						lAbsence.Genre === Enumere_Ressource_1.EGenreRessource.Exclusion ||
						lAbsence.Genre ===
							Enumere_Ressource_1.EGenreRessource.Infirmerie) &&
					lAbsence.PlaceDebut <= this.placeSaisieFin &&
					lAbsence.PlaceFin >= this.placeSaisieDebut
				) {
					lNbElevesPresents -= 1;
					lContinuer = false;
				}
			}
			for (let j = 0; lContinuer && j < lEleve.ListeDispenses.count(); j++) {
				lAbsence = lEleve.ListeDispenses.get(j);
				if (
					lAbsence.existe() &&
					lAbsence.PlaceDebut <= this.placeSaisieFin &&
					lAbsence.PlaceFin >= this.placeSaisieDebut &&
					!lAbsence.presenceOblig
				) {
					lNbElevesPresents -= 1;
					lContinuer = false;
				}
			}
		}
		return { nbEleves: lNbEleves, nbElevesPresents: lNbElevesPresents };
	}
	aUneAbsence(aNumEleve, aGenreAbs, aNumAbs, aAvecEnseignementALaMaison) {
		if (aNumEleve === 0) {
			return -1;
		}
		if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Punition) {
			return this.aUnePunition(aNumEleve);
		}
		if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Dispense) {
			return this.aUneDispense(aNumEleve, aAvecEnseignementALaMaison);
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.ListeAbsences.count(); i++) {
			const lAbsence = lEleve.ListeAbsences.get(i);
			if (
				lAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression &&
				(aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Absence ||
					(lAbsence.PlaceDebut <= this.placeSaisieFin &&
						lAbsence.PlaceFin >= this.placeSaisieDebut)) &&
				((aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation &&
					lAbsence.observation &&
					lAbsence.observation.Numero === aNumAbs) ||
					(aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Observation &&
						lAbsence.Genre === aGenreAbs))
			) {
				return i;
			}
		}
		return -1;
	}
	aUnePunition(aNumEleve) {
		if (aNumEleve === 0) {
			return -1;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.listePunitions.count(); i++) {
			const lAbsence = lEleve.listePunitions.get(i);
			if (
				lAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression &&
				(lAbsence.professeur === undefined ||
					lAbsence.professeur.Numero === this.numeroProf)
			) {
				return i;
			}
		}
		return -1;
	}
	aUneDemandeDeDispense(aNumEleve) {
		if (aNumEleve === 0) {
			return -1;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.listeDemandesDispense.count(); i++) {
			const lDemandeDispense = lEleve.listeDemandesDispense.get(i);
			if (
				lDemandeDispense.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
			) {
				return i;
			}
		}
		return -1;
	}
	getDemandeDeDispense(aNumEleve) {
		if (aNumEleve === 0) {
			return null;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		let lDemandeDispense;
		if (!!lEleve) {
			lEleve.listeDemandesDispense.parcourir((aDemande) => {
				if (aDemande.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
					lDemandeDispense = aDemande;
					return false;
				}
			});
		}
		return lDemandeDispense;
	}
	aUneDispense(aNumEleve, aAvecEnseignementALaMaison) {
		if (aNumEleve === 0) {
			return -1;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.ListeDispenses.count(); i++) {
			const lAbsence = lEleve.ListeDispenses.get(i);
			if (
				lAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression &&
				lAbsence.PlaceDebut <= this.placeSaisieFin &&
				lAbsence.PlaceFin >= this.placeSaisieDebut
			) {
				if (aAvecEnseignementALaMaison) {
					return i;
				}
				return lAbsence.estEnseignementALaMaison ? -1 : i;
			}
		}
		return -1;
	}
	getDispense(aNumEleve, aAvecEnseignementALaMaison) {
		if (aNumEleve === 0) {
			return null;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		let lDispense;
		if (!!lEleve) {
			lEleve.ListeDispenses.parcourir((aAbsence) => {
				if (
					aAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression &&
					aAbsence.PlaceDebut <= this.placeSaisieFin &&
					aAbsence.PlaceFin >= this.placeSaisieDebut
				) {
					if (aAvecEnseignementALaMaison) {
						lDispense = aAbsence;
						return false;
					}
					if (!aAbsence.estEnseignementALaMaison) {
						lDispense = aAbsence;
						return false;
					}
				}
			});
		}
		return lDispense;
	}
	aUneObservationVue(aNumEleve, aNumeroObservation) {
		if (aNumEleve === 0) {
			return -1;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.ListeAbsences.count(); i++) {
			const lAbsence = lEleve.ListeAbsences.get(i);
			if (
				lAbsence.Genre ===
					Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve &&
				ObjetRequetePageSaisieAbsences_1.ObjetRequetePageSaisieAbsences.isObjetElementObservationIndividuEleve(
					lAbsence,
				) &&
				lAbsence.observation &&
				lAbsence.observation.getNumero() === aNumeroObservation &&
				lAbsence.avecARObservation &&
				lAbsence.dateVisu
			) {
				return i;
			}
		}
		return -1;
	}
	calculerInfosEleve(aEleve) {
		aEleve.ExisteAbsenceOuverte = false;
		for (let J = 0; J < aEleve.ListeAbsences.count(); J++) {
			const LAbsence = aEleve.ListeAbsences.get(J);
			if (LAbsence.existe() && aEleve.DernierePlace < LAbsence.PlaceFin) {
				aEleve.DernierePlace = LAbsence.PlaceFin;
			}
			if (LAbsence.EstOuverte) {
				aEleve.ExisteAbsenceOuverte = true;
			}
		}
	}
	genreAbsenceDEleveEstEditable(
		aNumero,
		aGenre,
		aNumeroObservationVS,
		aGenreObservationVS,
	) {
		const lEleve = this.listeEleves.getElementParNumero(aNumero);
		const lColonne =
			aGenre !== Enumere_Ressource_1.EGenreRessource.Observation
				? this.listeColonnes.getElementParGenre(aGenre)
				: this.listeColonnes.getElementParNumero(aNumeroObservationVS);
		const lColonnesInactives = this.calculTableauColonnesInactives(aNumero);
		let lColonneNonEditable = false;
		lColonnesInactives.every((aObj) => {
			let lGenreColonne, lNumeroColonne;
			if (MethodesObjet_1.MethodesObjet.isNumeric(aObj)) {
				lGenreColonne = aObj;
				if (lColonne.getGenre() === lGenreColonne) {
					lColonneNonEditable = true;
					return false;
				}
			} else {
				lGenreColonne = aObj.genre || aObj;
				lNumeroColonne = aObj.numero || undefined;
				if (lColonne.egalParNumeroEtGenre(lNumeroColonne, lGenreColonne)) {
					lColonneNonEditable = true;
					return false;
				}
			}
			return true;
		});
		const lEleveNonEditabe =
			lEleve.estExclu ||
			lEleve.estSorti ||
			lEleve.sortiePeda ||
			lColonneNonEditable;
		const lAbsenceVerouille =
			this.Cours &&
			this.Cours.estAppelVerrouille &&
			[
				Enumere_Ressource_1.EGenreRessource.Absence,
				Enumere_Ressource_1.EGenreRessource.Retard,
			].includes(aGenre);
		const lAvecSaisieDefaultCarnet =
			aGenre !== Enumere_Ressource_1.EGenreRessource.Observation ||
			aGenreObservationVS !==
				TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet ||
			this.autorisations.saisieDefautCarnet;
		return (
			!!lEleve &&
			!!lColonne &&
			lColonne.Actif &&
			!lEleveNonEditabe &&
			!lAbsenceVerouille &&
			lAvecSaisieDefaultCarnet &&
			!this.autorisations.jourConsultUniquement
		);
	}
	peutSupprimerLAbsence(aAbsence) {
		const lResult = {
			peutSupprimer: true,
			avecMsg: false,
			genreMsg: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			strMsg: "",
		};
		if (
			this.etatUtilSco.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Etablissement
		) {
			return lResult;
		}
		if (!aAbsence) {
			return lResult;
		}
		const lGenreAbsence = aAbsence.getGenre();
		if (
			![
				Enumere_Ressource_1.EGenreRessource.Absence,
				Enumere_Ressource_1.EGenreRessource.Retard,
			].includes(lGenreAbsence)
		) {
			return lResult;
		}
		const lUsrConnecte = this.etatUtilSco.Identification.getMembre();
		const lEstAbsenceSaisieParAutreProf =
			aAbsence.Professeur.getGenre() ===
				TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Professeur &&
			aAbsence.Professeur.existeNumero() &&
			aAbsence.Professeur.getNumero() !== lUsrConnecte.getNumero();
		if (lEstAbsenceSaisieParAutreProf) {
			lResult.peutSupprimer = false;
			lResult.strMsg = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.msgAutreProf",
			);
			return lResult;
		}
		const lEstAbsenceSaisieParPersonnel =
			aAbsence.Professeur.getGenre() ===
				TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel &&
			aAbsence.Professeur.existeNumero();
		if (lEstAbsenceSaisieParPersonnel) {
			lResult.peutSupprimer = false;
			lResult.strMsg = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.msgAutrePersonnel",
			);
			return lResult;
		}
		const lEstUneSaisieVS =
			aAbsence.Professeur.getGenre() ===
			TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Administratif;
		if (lEstUneSaisieVS) {
			const lEstAbsence =
				lGenreAbsence === Enumere_Ressource_1.EGenreRessource.Absence;
			lResult.peutSupprimer = lEstAbsence
				? this.autorisations.suppressionAbsenceDeVS
				: this.autorisations.suppressionRetardDeVS;
			lResult.strMessage = lResult.peutSupprimer
				? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.msgConfimation")
				: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.msgPasAutorise");
			lResult.genreMsg = lResult.peutSupprimer
				? Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation
				: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information;
			return lResult;
		}
		return lResult;
	}
	estUnSaisieVS(aAbsence) {
		const lResult =
			!!aAbsence &&
			[
				Enumere_Ressource_1.EGenreRessource.Absence,
				Enumere_Ressource_1.EGenreRessource.Retard,
			].includes(aAbsence.getGenre()) &&
			(this.etatUtilSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur ||
				this.etatUtilSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur) &&
			aAbsence.Professeur.getGenre() !==
				TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Professeur &&
			!aAbsence.Professeur.existeNumero();
		return lResult;
	}
	getListeColonnesTriees() {
		let lListe = new ObjetListeElements_1.ObjetListeElements();
		if (this.listeColonnes) {
			lListe = MethodesObjet_1.MethodesObjet.dupliquer(this.listeColonnes);
			lListe.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Dispense;
				}),
			]);
			lListe.trier();
		}
		return lListe;
	}
	getAffichageGenre(aNumEleve, aGenreAbs, aNumAbs, aTypeObs) {
		let lResult = "";
		let lAbsence, lElementAbsence, lImageCoche, lTexte;
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		switch (aGenreAbs) {
			case Enumere_Ressource_1.EGenreRessource.Absence:
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
			case Enumere_Ressource_1.EGenreRessource.Exclusion: {
				if (
					aGenreAbs === Enumere_Ressource_1.EGenreRessource.Absence &&
					!!lEleve &&
					lEleve.estDetache
				) {
					lResult = (0, tag_1.tag)("i", {
						class: [
							this.Cours && this.Cours.estSortiePedagogique
								? "icon_remove"
								: "icon_eleve_detache",
							"theme-color",
						],
					});
				} else {
					lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs);
					lElementAbsence =
						lAbsence > -1 ? lEleve.ListeAbsences.get(lAbsence) : false;
					const lClassesImage = [];
					if (lElementAbsence && lElementAbsence.partielle) {
						lClassesImage.push("icon_contour_check");
					} else {
						lClassesImage.push("icon_ok");
					}
					if (this.estUnSaisieVS(lElementAbsence)) {
						lClassesImage.push("mix-icon_vs", "i-red");
					} else if (
						aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Absence
					) {
						let lEstPubliee;
						if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Exclusion) {
							lEstPubliee = !!lElementAbsence.datePublication;
						} else {
							lEstPubliee = lElementAbsence.estPubliee;
						}
						if (!lEstPubliee) {
							lClassesImage.push("mix-icon_remove", "i-red");
						} else {
							lClassesImage.push("theme-color");
						}
					}
					lResult =
						lAbsence >= 0
							? '<i role="img" class="' + lClassesImage.join(" ") + '"></i>'
							: "";
				}
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs);
				lElementAbsence =
					lAbsence > -1 ? lEleve.ListeAbsences.get(lAbsence) : null;
				if (
					(lElementAbsence === null || lElementAbsence === void 0
						? void 0
						: lElementAbsence.type) !==
					TTypePreparerRepas_1.TTypePreparerRepas.prNonDP
				) {
					lImageCoche =
						lElementAbsence.type ===
						TTypePreparerRepas_1.TTypePreparerRepas.prOui
							? " prevu"
							: lElementAbsence.type ===
									TTypePreparerRepas_1.TTypePreparerRepas.prNon
								? " mix-icon_remove"
								: "";
					lResult =
						lAbsence >= 0
							? '<i role="img" class="icon_food' + lImageCoche + '"></i>'
							: "";
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Observation:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs, aNumAbs);
				if (aTypeObs === null || aTypeObs === undefined) {
					aTypeObs =
						this.listeColonnes.getElementParNumero(aNumAbs).genreObservation;
				} else {
					aTypeObs = parseInt(aTypeObs);
				}
				if (lAbsence >= 0) {
					if (
						aTypeObs !==
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent &&
						aTypeObs !==
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement
					) {
						lElementAbsence = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeAbsences.get(lAbsence);
						lImageCoche =
							lElementAbsence.estPubliee && lElementAbsence.commentaire !== ""
								? "icon_comment_vide"
								: "icon_ok";
						lImageCoche += !lElementAbsence.estPubliee
							? " mix-icon_remove i-red"
							: "";
						lResult = '<i role="img" class="' + lImageCoche + '"></i>';
					} else {
						lElementAbsence = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeAbsences.get(lAbsence);
						lResult = lElementAbsence.commentaire !== "" ? " ********** " : "";
						if (!lElementAbsence.estPubliee) {
							lResult =
								'<div class="protected-contain"><span class="publi-color">' +
								lResult +
								'</span><i role="img" class="icon_info_sondage_publier mix-icon_remove i-red"></i></div>';
						} else {
							lResult =
								'<div class="protected-contain"><span class="publi-color">' +
								lResult +
								"</span></div>";
						}
					}
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs);
				lTexte =
					lAbsence >= 0
						? ObjetTraduction_1.GTraductions.getValeur("Absence.RetardDe", [
								this.listeEleves
									.getElementParNumero(aNumEleve)
									.ListeAbsences.get(lAbsence).Duree,
							])
						: "";
				lResult =
					lAbsence >= 0
						? `<span class="tableAbsenceCorpsCelluleRetard" aria-label="${lTexte}">` +
							this.listeEleves
								.getElementParNumero(aNumEleve)
								.ListeAbsences.get(lAbsence).Duree +
							"'"
						: "";
				break;
			case Enumere_Ressource_1.EGenreRessource.Punition: {
				const lIndicePunitionEleve = this.aUnePunition(aNumEleve);
				if (lIndicePunitionEleve >= 0) {
					const lClassesIcones = [];
					const lPunition = this.listeEleves
						.getElementParNumero(aNumEleve)
						.listePunitions.get(lIndicePunitionEleve);
					const lNaturePunition = lPunition ? lPunition.naturePunition : null;
					if (lNaturePunition) {
						switch (lNaturePunition.getGenre()) {
							case TypeGenrePunition_1.TypeGenrePunition.GP_Devoir:
								lClassesIcones.push("icon_nouveau_document");
								break;
							case TypeGenrePunition_1.TypeGenrePunition.GP_Retenues:
								lClassesIcones.push("icon_time");
								break;
							case TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours:
							case TypeGenrePunition_1.TypeGenrePunition.GP_Autre:
								lClassesIcones.push("icon_punition");
								break;
							default:
								break;
						}
					}
					if (lClassesIcones.length === 0) {
						lClassesIcones.push("icon_punition");
					}
					const lDatePublicationPunition = lPunition.datePublication;
					let lNomMixIcon;
					let lCouleurMixIcon;
					if (lDatePublicationPunition) {
						if (
							ObjetDate_1.GDate.estAvantJour(
								lDatePublicationPunition,
								ObjetDate_1.GDate.getJour(ObjetDate_1.GDate.demain),
							)
						) {
							lNomMixIcon = "icon_ok";
							lCouleurMixIcon = "i-green";
						} else {
							lNomMixIcon = "icon_edt_permanence";
						}
					} else {
						lNomMixIcon = "icon_remove";
						lCouleurMixIcon = "i-red";
					}
					if (lNomMixIcon) {
						lClassesIcones.push("mix-" + lNomMixIcon);
						if (lCouleurMixIcon) {
							lClassesIcones.push(lCouleurMixIcon);
						}
					}
					lResult = `<i role="img" class="${lClassesIcones.join(" ")}" aria-hidden="true"></i>`;
				}
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.Dispense: {
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs, null, true);
				const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
				const lEleveALaMaison = lEleve.estEnseignementALaMaison;
				const lIndiceDemandeDispense = this.aUneDemandeDeDispense(aNumEleve);
				if (lAbsence >= 0 || !!lEleveALaMaison || lIndiceDemandeDispense >= 0) {
					const lHtml = [];
					lElementAbsence =
						lAbsence > -1 ? lEleve.ListeDispenses.get(lAbsence) : null;
					const lEstVS =
						(this.etatUtilSco.GenreEspace ===
							Enumere_Espace_1.EGenreEspace.Professeur ||
							this.etatUtilSco.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Mobile_Professeur) &&
						lElementAbsence &&
						!lElementAbsence.Professeur.existeNumero();
					const lDemandeDispense =
						lIndiceDemandeDispense > -1
							? lEleve.listeDemandesDispense.get(lIndiceDemandeDispense)
							: false;
					if (!!lElementAbsence) {
						lHtml.push(
							`<i role="img" class="icon_ok ${lEstVS ? " mix-icon_vs i-red" : ""}" aria-hidden="true"></i>`,
						);
					} else if (!!lDemandeDispense) {
						if (
							lDemandeDispense.estRefusee &&
							!lDemandeDispense.estRefuseeAnnulable
						) {
							lHtml.push(
								`<i role="img" class="icon_diffuser_info" aria-hidden="true"></i>`,
							);
						} else {
							const lAvecCroix =
								lDemandeDispense.estRefusee && lDemandeDispense.estTraitee;
							lHtml.push(
								`<i role="img" class="icon_question ${lAvecCroix ? "mix-icon_fermeture_widget i-red" : ""}" aria-hidden="true"></i>`,
							);
						}
					}
					if (
						!!lElementAbsence &&
						(lElementAbsence.commentaire ||
							lElementAbsence.publierPJFeuilleDAppel)
					) {
						lHtml.push(
							`<i role="img" class="${lElementAbsence.publierPJFeuilleDAppel ? "icon_piece_jointe" : "icon_comment_vide"}${lElementAbsence.publierPJFeuilleDAppel && lElementAbsence.commentaire ? " mix-icon_comment_vide mix-i-large" : ""}" aria-hidden="true"></i>`,
						);
					}
					lResult = lHtml.join("");
				}
				break;
			}
			default:
				lResult = false;
				break;
		}
		return lResult;
	}
	_majListeElevesVisible() {
		const lThis = this;
		this.listeEleves.parcourir((aEle) => {
			if (aEle.delegue) {
				aEle.libelleHtml =
					aEle.getLibelle() +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.IndentificationDelegue",
					);
			} else {
				aEle.libelleHtml = aEle.getLibelle();
			}
			let lEstAbsent = false;
			if (aEle.estExclu) {
				aEle.Visible = false;
			} else if (aEle.ListeAbsences && aEle.ListeAbsences.count()) {
				aEle.ListeAbsences.parcourir((aEleAbs) => {
					if (
						aEleAbs.PlaceDebut <= lThis.PlaceSaisieDebut &&
						aEleAbs.PlaceFin >= lThis.PlaceSaisieFin
					) {
						lEstAbsent = true;
						return false;
					}
				});
				if (lEstAbsent) {
					aEle.Visible = false;
				}
			}
		});
	}
	getTraductionDeGenreCommande(aGenreCommande, aPublie) {
		if (aGenreCommande === this.genreCommandeMenuContextVS.creerMemo) {
			return ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.CreerUnMemo");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.creerValorisation
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.CreerUnValorisation",
			);
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.supprimerEleveDuCours
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.SuppressionEleve",
			);
		} else if (aGenreCommande === this.genreCommandeMenuContextVS.modifier) {
			return ObjetTraduction_1.GTraductions.getValeur("Modifier");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.modifierMotif
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.ModifierMotifRetard",
			);
		} else if (aGenreCommande === this.genreCommandeMenuContextVS.supprimer) {
			return ObjetTraduction_1.GTraductions.getValeur("Supprimer");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.publierObservation
		) {
			return aPublie
				? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Depublier")
				: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.PublierParentsEleves",
					);
		} else {
			return "";
		}
	}
	formatTradAbs(aAbs, aGenre) {
		return ObjetMoteurAbsences.formatTraductionAbs(aAbs, aGenre);
	}
	static formatTraductionAbs(aAbs, aGenre) {
		if (!!aAbs) {
			const lDateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(aAbs.PlaceDebut);
			const lDateDebutTest = new Date(lDateDebut.getTime());
			const lDateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
				aAbs.PlaceFin,
				true,
			);
			const lDateFinTest = new Date(lDateFin.getTime());
			if (
				lDateDebutTest.setHours(0, 0, 0, 0) ===
				lDateFinTest.setHours(0, 0, 0, 0)
			) {
				let lCleTraduction;
				if (aAbs.estEnseignementALaMaison) {
					lCleTraduction = "Absence.ALaMaisonLeDeA";
				} else {
					if (aGenre === Enumere_Ressource_1.EGenreRessource.Absence) {
						lCleTraduction = "Absence.AbsenceLeDeA";
					} else {
						lCleTraduction = "Absence.DispenseLeDeA";
					}
				}
				return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
					ObjetDate_1.GDate.formatDate(lDateDebut, "%JJ/%MM/%AAAA"),
					ObjetDate_1.GDate.formatDate(
						lDateDebut,
						"%hh" +
							ObjetTraduction_1.GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
					ObjetDate_1.GDate.formatDate(
						lDateFin,
						"%hh" +
							ObjetTraduction_1.GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
				]);
			} else {
				let lCleTraduction;
				if (aAbs.estEnseignementALaMaison) {
					lCleTraduction = "Absence.ALaMaisonDuAu";
				} else {
					if (aGenre === Enumere_Ressource_1.EGenreRessource.Absence) {
						lCleTraduction = "Absence.AbsenceDuAu";
					} else {
						lCleTraduction = "Absence.DispenseDuAu";
					}
				}
				return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
					ObjetDate_1.GDate.formatDate(
						lDateDebut,
						"%JJ/%MM/%AAAA %hh" +
							ObjetTraduction_1.GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
					ObjetDate_1.GDate.formatDate(
						lDateFin,
						"%JJ/%MM/%AAAA %hh" +
							ObjetTraduction_1.GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
				]);
			}
		} else {
		}
	}
	getListeIconesElevePourFeuilleDAppel(aEleve) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let avecCvAuto = false;
		let avecCvPerso = false;
		let avecAbsencePrecedent = false;
		for (let j = 0; j < aEleve.listeConvocations.count(); j++) {
			const lConvocation = aEleve.listeConvocations.get(j);
			if (lConvocation.Genre === 1) {
				avecCvAuto = true;
			} else if (lConvocation.Genre === 0) {
				avecCvPerso = true;
			}
		}
		if (aEleve.absentAuPrecedentCoursJournee) {
			avecAbsencePrecedent = true;
		}
		Object.keys(TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel).forEach(
			(aCle) => {
				const lType = TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel[aCle];
				if (MethodesObjet_1.MethodesObjet.isString(lType)) {
					return;
				}
				const lElement = new ObjetElement_1.ObjetElement("", null, lType);
				lElement.actif = false;
				lElement.avecEvenement = false;
				lElement.ordre =
					TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppelUtil.getOrdreDeType(
						lType,
					);
				let lParametresIconeDeType = null;
				let lEstIconeAAfficher = true;
				switch (lType) {
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.delegue:
						if (aEleve.delegue) {
							lParametresIconeDeType = {
								estDelegueClasse: !!aEleve.delegue.estDelegueClasse,
								estDelegueEco: !!aEleve.delegue.estDelegueEco,
								estDelegueAutre: !!aEleve.delegue.estDelegueAutre,
							};
							lElement.setLibelle(aEleve.delegue.hint);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.accompagnant:
						if (aEleve.HintAccompagnants && aEleve.HintAccompagnants !== "") {
							lElement.setLibelle(aEleve.HintAccompagnants);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.projetAccompagnement:
						if (
							aEleve.projetsAccompagnement &&
							aEleve.projetsAccompagnement !== ""
						) {
							lParametresIconeDeType = {
								estPAmedical: !!aEleve.nbProjetsMedicaux,
								sontPlusieursPA: aEleve.nbProjet > 1,
							};
							lElement.setLibelle(aEleve.projetsAccompagnement);
							lElement.actif = true;
							lElement.avecEvenement = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.gap:
						if (!!aEleve.faitPartieDUnGAP) {
							lElement.setLibelle(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.EleveFaitPartieGAP",
								),
							);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.anniversaire:
						if (aEleve.anniv !== "") {
							lElement.setLibelle(aEleve.anniv);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.valorisation:
						if (!!aEleve.avecValorisation) {
							lElement.setLibelle(aEleve.infoValorisation);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.devoir:
						if (!!aEleve.devoirARendre && aEleve.devoirARendre.existeNumero()) {
							if (aEleve.devoirARendre.programmation.Genre === 1) {
								lParametresIconeDeType = { rendu: true };
							}
							lElement.setLibelle(aEleve.devoirARendre.Libelle);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.memo:
						if (!!aEleve.avecMemo) {
							lElement.setLibelle(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.memosDeLaVS",
								),
							);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.convocationVS:
						if (avecCvPerso) {
							lElement.setLibelle(
								aEleve.listeConvocations.getElementParGenre(0).Libelle,
							);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.absencePrecedent:
						if (avecAbsencePrecedent) {
							lElement.setLibelle(aEleve.motifAbsentAuPrecedentCoursJournee);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.absenceConvocationAuto:
						if (avecCvAuto) {
							lElement.setLibelle(
								aEleve.listeConvocations.getElementParGenre(1).Libelle,
							);
							lElement.actif = true;
							lElement.avecEvenement =
								aEleve.listeAbsencesNonReglees &&
								aEleve.listeAbsencesNonReglees.count() > 0;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.enseignementMaison:
						if (!!aEleve.estEnseignementALaMaison) {
							let lTitreAlaMaison = "";
							const lDispense = aEleve.ListeDispenses.getElementParGenre(
								Enumere_Ressource_1.EGenreRessource.Dispense,
							);
							lTitreAlaMaison = !!lDispense
								? this.formatTradAbs(
										lDispense,
										Enumere_Ressource_1.EGenreRessource.Dispense,
									)
								: "";
							lElement.setLibelle(lTitreAlaMaison);
							lElement.actif = true;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.absentCoursPrecedentDuProf:
						if (IE.estMobile && aEleve.absentAuDernierCours) {
							lElement.setLibelle(aEleve.hintAbsentAuDernierCours);
							lElement.actif = !!IE.estMobile;
						}
						break;
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.usagerBusScolaire:
					case TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
						.autoriseASortirSeul:
						lEstIconeAAfficher = false;
						break;
					default:
						break;
				}
				lElement.class =
					TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppelUtil.getClassIconeDeType(
						lType,
						lParametresIconeDeType,
					);
				if (lEstIconeAAfficher) {
					lListe.addElement(lElement);
				}
			},
		);
		lListe.setTri([ObjetTri_1.ObjetTri.init("ordre")]);
		lListe.trier();
		return lListe;
	}
	async afficherMessageConfirmationAppelTermineAvecDemandeDispense() {
		return await this.appSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.demandeDispense.messageConfirmAppel",
				),
			});
	}
	avecDemandesDispenseNonTraitee(aListe) {
		return (
			aListe &&
			aListe
				.getListeElements(
					(aDemande) =>
						aDemande.getEtat() !== Enumere_Etat_1.EGenreEtat.Modification &&
						!aDemande.estTraitee,
				)
				.count() > 0
		);
	}
	updateDemandeEleve(aDemande) {
		if (!aDemande) {
			return;
		}
		const lEleveDeLaDemande = this.listeEleves.getElementParNumero(
			aDemande.eleve.getNumero(),
		);
		if (lEleveDeLaDemande) {
			lEleveDeLaDemande.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lEleveDeLaDemande.listeDemandesDispense =
				new ObjetListeElements_1.ObjetListeElements().add(aDemande);
		}
	}
	ouvrirFenetreDemandeDispense(aElement, aCallback, aInfos = {}) {
		let lListe = aElement;
		const lEstUnObjetElement = aElement instanceof ObjetElement_1.ObjetElement;
		if (lEstUnObjetElement) {
			lListe = new ObjetListeElements_1.ObjetListeElements().add(aElement);
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DemandeDispense_1.ObjetFenetre_DemandeDispense,
			{
				pere: this,
				evenement: (aGenreBouton, aParams) => {
					if (
						aGenreBouton === 1 &&
						aParams &&
						aParams.listeDemandeASaisir &&
						aParams.listeDemandesDispense
					) {
						aParams.listeDemandeASaisir.parcourir((aDemande) => {
							this.updateDemandeEleve(aDemande);
						});
						if (aCallback) {
							aCallback(aParams);
						}
					}
				},
				initialiser(aInstanceFenetre) {
					aInstanceFenetre.setOptionsFenetre({
						titre: lEstUnObjetElement
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.demandeDispense.demandeDeDispenseATraiter",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.demandeDispense.demandesDeDispenseDesResp",
									[lListe.count()],
								),
					});
				},
			},
		);
		lFenetre.setDonnees({
			listeDemandesDispense: lListe,
			placeSaisieDebut: this.placeSaisieDebut,
			placeSaisieFin: this.placeSaisieFin,
		});
	}
}
exports.ObjetMoteurAbsences = ObjetMoteurAbsences;
