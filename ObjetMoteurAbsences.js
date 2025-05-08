const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TTypePreparerRepas } = require("TTypePreparerRepas.js");
const { TypeGenreIndividuAuteur } = require("TypeGenreIndividuAuteur.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const {
	EGenreEvenementSaisieAbsence,
} = require("Enumere_EvenementSaisieAbsences.js");
const {
	TypeIconeFeuilleDAppel,
	TypeIconeFeuilleDAppelUtil,
} = require("TypeIconeFeuilleDAppel.js");
const { tag } = require("tag.js");
const {
	ObjetFenetre_DemandeDispense,
} = require("ObjetFenetre_DemandeDispense.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
class ObjetMoteurAbsences {
	constructor() {
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
		};
	}
	setOptions(aParam) {
		$.extend(this, aParam);
	}
	getAbsence(AEleve, AGenreAbsence, APlace, aNumObs) {
		let lListe = "ListeAbsences";
		if (AGenreAbsence === EGenreRessource.Dispense) {
			lListe = "ListeDispenses";
		} else if (AGenreAbsence === EGenreRessource.Punition) {
			lListe = "listePunitions";
		}
		const N = AEleve[lListe].count();
		if (
			AGenreAbsence === EGenreRessource.Observation &&
			aNumObs !== null &&
			aNumObs !== undefined
		) {
			AGenreAbsence = EGenreRessource.ObservationProfesseurEleve;
		}
		for (let J = 0; J < N; J++) {
			const LAbsence = AEleve[lListe].get(J);
			if (LAbsence.existe() && LAbsence.getGenre() === AGenreAbsence) {
				switch (AGenreAbsence) {
					case EGenreRessource.ObservationProfesseurEleve: {
						if (LAbsence.observation.Numero === aNumObs) {
							return LAbsence;
						}
						break;
					}
					case EGenreRessource.Infirmerie: {
						if (
							this.placeSaisieDebut <= LAbsence.PlaceDebut &&
							this.placeSaisieFin >= LAbsence.PlaceFin
						) {
							return LAbsence;
						}
						break;
					}
					case EGenreRessource.Punition: {
						if (
							(APlace >= LAbsence.PlaceDebut && APlace <= LAbsence.PlaceFin) ||
							(this.placeSaisieDebut <= LAbsence.placeDemande &&
								this.placeSaisieFin >= LAbsence.placeDemande)
						) {
							return LAbsence;
						}
						break;
					}
					case EGenreRessource.RepasAPreparer: {
						if (LAbsence.type !== TTypePreparerRepas.prNonDP) {
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
			LAbsence = new ObjetElement(null, null, parseInt(AGenreAbsence));
			LAbsence.setEtat(EGenreEtat.Creation);
			LAbsence.Professeur = new ObjetElement(
				null,
				GEtatUtilisateur.Identification.getMembre().getNumero(),
				GEtatUtilisateur.Identification.getMembre().getGenre(),
			);
			LAbsence.PlaceDebut = APlaceDebut;
			LAbsence.PlaceFin =
				AGenreAbsence !== EGenreRessource.Retard ? APlaceFin : APlaceDebut;
			let lDuree = ADuree;
			if (
				AGenreAbsence === EGenreRessource.Retard &&
				this.calculAutoDureeRetard
			) {
				const lDateDebut = GDate.placeAnnuelleEnDate(APlaceDebut);
				const LDateFin = GDate.placeAnnuelleEnDate(APlaceFin, true);
				const lDateCourante = GDate.getDateHeureCourante();
				if (lDateCourante >= lDateDebut && lDateCourante <= LDateFin) {
					lDuree = Math.ceil((lDateCourante - lDateDebut) / 1000 / 60);
				}
			}
			LAbsence.Duree = lDuree;
			if (AGenreAbsence === EGenreRessource.Infirmerie) {
				LAbsence.DateDebut = GDate.placeAnnuelleEnDate(APlaceDebut);
				LAbsence.DateFin = GDate.placeAnnuelleEnDate(APlaceFin, true);
				LAbsence.Accompagnateur = new ObjetElement();
				LAbsence.commentaire = "";
				LAbsence.AvecInfirmerie = true;
			}
			if (AGenreAbsence === EGenreRessource.Exclusion) {
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
			if (AGenreAbsence === EGenreRessource.ObservationProfesseurEleve) {
				const lTypeObservation = this.listeColonnes.getElementParNumeroEtGenre(
					aTypeObservation,
					EGenreRessource.Observation,
				);
				LAbsence.observation =
					MethodesObjet.dupliquer(lTypeObservation) ||
					new ObjetElement(null, aTypeObservation);
				LAbsence.commentaire = "";
				const lObservation =
					this.listeColonnes.getElementParNumero(aTypeObservation);
				if (lObservation) {
					LAbsence.estPubliee = lObservation.publiable;
				}
			}
			if (AGenreAbsence === EGenreRessource.Dispense) {
				LAbsence.dateDebut = GDate.placeAnnuelleEnDate(APlaceDebut);
				LAbsence.dateFin = GDate.placeAnnuelleEnDate(APlaceFin, true);
				LAbsence.commentaire = "";
				LAbsence.presenceOblig =
					GParametres.general.valeurDefautPresenceDispense;
				LAbsence.estSurCours = true;
				LAbsence.matiere = this.Cours.matiere;
			}
			if (AGenreAbsence === EGenreRessource.Absence) {
				const lPlaceAnnuelleCourante = GDate.dateEnPlaceAnnuelle(new Date());
				LAbsence.listeMotifs = new ObjetListeElements();
				LAbsence.listeMotifs.addElement(new ObjetElement("", 0));
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
			const lTris = [ObjetTri.init("Genre"), ObjetTri.init("PlaceDebut")];
			if (AGenreAbsence === EGenreRessource.Dispense) {
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
	existeAbsenceOuRetardPosterieurs(AAbsence, AEleve) {
		if (AAbsence.PlaceFin < AEleve.DernierePlace) {
			return true;
		} else {
			return false;
		}
	}
	avecSaisieMotif(aGenreAbsence, aAvecSaisieDuree) {
		if (!!aAvecSaisieDuree && aGenreAbsence === EGenreRessource.Retard) {
			return true;
		} else {
			return this.getDroitSaisieMotif(aGenreAbsence);
		}
	}
	getDroitSaisieMotif(aGenreAbsence) {
		switch (aGenreAbsence) {
			case EGenreRessource.Absence:
				return !!GApplication.droits.get(
					TypeDroits.fonctionnalites.appelSaisirMotifJustifDAbsence,
				);
			case EGenreRessource.Retard:
				return !!GApplication.droits.get(
					TypeDroits.absences.avecSaisieMotifRetard,
				);
			default:
				return false;
		}
	}
	surEvenementSaisieAbsence(aParam) {
		if (aParam.genreAbsence === EGenreRessource.Observation) {
			aParam.genreAbsence = EGenreRessource.ObservationProfesseurEleve;
		}
		aParam.eleve.setEtat(EGenreEtat.Modification);
		const lEtat =
			aParam.typeSaisie === EGenreEtat.Creation
				? EGenreEtat.Creation
				: aParam.typeSaisie === EGenreEtat.Suppression
					? EGenreEtat.Suppression
					: aParam.typeSaisie === EGenreEtat.Modification
						? EGenreEtat.Modification
						: EGenreEtat.Aucun;
		if (lEtat === EGenreEtat.Creation) {
			if (this.avecSaisieMotif(aParam.genreAbsence, aParam.avecSaisieDuree)) {
				aParam.fonctionSurOuvrirListeMotif(aParam);
				return;
			}
			if (!aParam.eleve.ListeAbsences) {
				aParam.eleve.ListeAbsences = new ObjetListeElements();
			}
			if (!aParam.eleve.ListeDispenses) {
				aParam.eleve.ListeDispenses = new ObjetListeElements();
			}
			this.creerAbsence(
				aParam.eleve,
				aParam.genreAbsence,
				aParam.placeDebut,
				aParam.placeFin,
				aParam.genreAbsence === EGenreRessource.Retard
					? this.dureeRetard
					: null,
				null,
				aParam.typeObservation,
				aParam.listeMotifs,
			);
		} else {
			aParam.eleve.setEtat(EGenreEtat.Modification);
			let lListe = "ListeAbsences";
			let LAbsence;
			if (aParam.genreAbsence === EGenreRessource.Dispense) {
				lListe = "ListeDispenses";
			} else if (aParam.genreAbsence === EGenreRessource.Punition) {
				lListe = "listePunitions";
			}
			if (lEtat === EGenreEtat.Suppression) {
				const N = aParam.eleve[lListe].count();
				for (let J = 0; J < N; J++) {
					LAbsence = aParam.eleve[lListe].get(J);
					if (LAbsence.getEtat() !== EGenreEtat.Suppression) {
						if (
							(aParam.genreAbsence !==
								EGenreRessource.ObservationProfesseurEleve &&
								LAbsence.getGenre() === aParam.genreAbsence &&
								aParam.placeFin >= LAbsence.PlaceDebut &&
								aParam.placeDebut <= LAbsence.PlaceFin) ||
							(aParam.genreAbsence ===
								EGenreRessource.ObservationProfesseurEleve &&
								LAbsence.getGenre() === aParam.genreAbsence &&
								LAbsence.observation.Numero === aParam.typeObservation) ||
							(aParam.genreAbsence === EGenreRessource.Punition &&
								aParam.placeFin >= LAbsence.placeDemande &&
								aParam.placeDebut <= LAbsence.placeDemande)
						) {
							if (
								(aParam.genreAbsence === EGenreRessource.Absence ||
									aParam.genreAbsence === EGenreRessource.Retard) &&
								(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
									GEtatUtilisateur.GenreEspace ===
										EGenreEspace.Mobile_Professeur)
							) {
								let lPeutSuppr = this.peutSupprimerLAbsence(LAbsence);
								if (lPeutSuppr.peutSupprimer === false) {
									GApplication.getMessage().afficher({
										type: lPeutSuppr.genreMsg,
										message: lPeutSuppr.strMsg,
									});
									aParam.fonctionApresPasPossible(aParam);
									return false;
								}
							}
							if (aParam.genreAbsence === EGenreRessource.Absence) {
								if (
									GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
									GEtatUtilisateur.GenreEspace ===
										EGenreEspace.Mobile_Professeur
								) {
									if (
										!LAbsence.EstOuverte &&
										!LAbsence.Professeur.existeNumero() &&
										!this.autorisations.suppressionAbsenceDeVS
									) {
										GApplication.getMessage().afficher({
											type: EGenreBoiteMessage.Information,
											message: GTraductions.getValeur(
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
									GEtatUtilisateur.getGenreOnglet() ===
										EGenreOnglet.SaisieAbsences_AppelEtSuivi ||
										(aParam.placeDebut <= LAbsence.PlaceDebut &&
											aParam.placeFin >= LAbsence.PlaceFin)
										? EGenreEtat.Suppression
										: EGenreEtat.Modification,
								);
							} else {
								LAbsence.setEtat(EGenreEtat.Suppression);
							}
						}
					}
				}
			} else {
				if (aParam.genreAbsence === EGenreRessource.RepasAPreparer) {
					LAbsence = aParam.eleve[lListe].getElementParNumeroEtGenre(
						null,
						aParam.genreAbsence,
					);
					if (LAbsence.type === TTypePreparerRepas.prNon) {
						LAbsence.type = TTypePreparerRepas.prOui;
					} else if (LAbsence.type === TTypePreparerRepas.prOui) {
						LAbsence.type = TTypePreparerRepas.prNon;
					}
					LAbsence.setEtat(EGenreEtat.Creation);
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
					aColonne.Genre === EGenreRessource.Observation &&
					aColonne.avecARObservation
				) {
					lTabInactif.push({
						genre: EGenreRessource.Observation,
						numero: aColonne.getNumero(),
					});
				} else {
					lTabInactif.push(aColonne.Genre);
				}
			});
		} else {
			if (this.autorisations.avecSaisieAbsence !== true) {
				lTabInactif.push(EGenreRessource.Absence);
			}
			if (this.autorisations.avecSaisieRetard !== true) {
				lTabInactif.push(EGenreRessource.Retard);
			}
			if (this.autorisations.avecSaisieDispense !== true) {
				lTabInactif.push(EGenreRessource.Dispense);
			}
			if (lEleve && lEleve.eleveAjouteAuCours) {
				lTabInactif.push(EGenreRessource.Absence);
				lTabInactif.push(EGenreRessource.Exclusion);
			}
			if (lEleve && lEleve.estEnseignementALaMaison) {
				lTabInactif.push(EGenreRessource.Dispense);
				const lDispenseALaMaison = this.aUneDispense(aNumEleve, true);
				const lElementDispenseMaison = this.listeEleves
					.getElementParNumero(aNumEleve)
					.ListeDispenses.get(lDispenseALaMaison);
				if (
					!!lElementDispenseMaison &&
					!!lElementDispenseMaison.estEnseignementALaMaison
				) {
					lTabInactif.push(EGenreRessource.Infirmerie);
				}
				if (!!lElementDispenseMaison && !lElementDispenseMaison.presenceOblig) {
					if (!this.Cours || !this.Cours.estAvecLienVisio) {
						lTabInactif.push(EGenreRessource.Absence);
					}
				}
			}
			if (this.Cours && this.Cours.estSortiePedagogique) {
				lTabInactif.push(
					EGenreRessource.Infirmerie,
					EGenreRessource.Exclusion,
					EGenreRessource.Dispense,
				);
			}
			for (let j = 0; j < this.listeColonnes.count(); j++) {
				const lColonne = this.listeColonnes.get(j);
				if (lEleve && lEleve.estDetache) {
					if (
						lColonne.Genre === EGenreRessource.Observation &&
						lColonne.avecARObservation
					) {
						lTabInactif.push({
							genre: EGenreRessource.Observation,
							numero: lColonne.getNumero(),
						});
					}
					lTabInactif.push(lColonne.Genre);
				} else {
					if (
						lColonne.Genre === EGenreRessource.Observation &&
						lColonne.avecARObservation
					) {
						if (
							this.aUneObservationVue(aNumEleve, lColonne.getNumero()) !== -1
						) {
							lTabInactif.push({
								genre: EGenreRessource.Observation,
								numero: lColonne.getNumero(),
							});
						}
					}
					if (
						lColonne.Genre === EGenreRessource.Absence &&
						(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
							GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur)
					) {
						lAbsence = this.aUneAbsence(aNumEleve, EGenreRessource.Absence);
						if (lAbsence !== -1) {
							lElementAbs = this.listeEleves
								.getElementParNumero(aNumEleve)
								.ListeAbsences.get(lAbsence);
							if (!lElementAbs.EstOuverte) {
								if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur.GIA_Administratif &&
									!this.autorisations.suppressionAbsenceDeVS
								) {
									lTabInactif.push(EGenreRessource.Absence);
								} else if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur.GIA_Personnel &&
									!this.autorisations.suppressionAbsenceDeVS
								) {
									lTabInactif.push(EGenreRessource.Absence);
								} else if (
									lElementAbs.Professeur.getGenre() ===
										TypeGenreIndividuAuteur.GIA_Professeur &&
									lElementAbs.Professeur.getNumero() !==
										GEtatUtilisateur.Identification.getMembre().getNumero()
								) {
									lTabInactif.push(EGenreRessource.Absence);
								}
							}
						}
					}
					if (
						lColonne.Genre === EGenreRessource.Retard &&
						(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
							GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur)
					) {
						lAbsence = this.aUneAbsence(aNumEleve, EGenreRessource.Retard);
						if (lAbsence !== -1) {
							lElementAbs = this.listeEleves
								.getElementParNumero(aNumEleve)
								.ListeAbsences.get(lAbsence);
							if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur.GIA_Administratif &&
								!this.autorisations.suppressionRetardDeVS
							) {
								lTabInactif.push(EGenreRessource.Retard);
							} else if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur.GIA_Personnel &&
								!this.autorisations.suppressionRetardDeVS
							) {
								lTabInactif.push(EGenreRessource.Retard);
							} else if (
								lElementAbs.Professeur.getGenre() ===
									TypeGenreIndividuAuteur.GIA_Professeur &&
								lElementAbs.Professeur.getNumero() !==
									GEtatUtilisateur.Identification.getMembre().getNumero()
							) {
								lTabInactif.push(EGenreRessource.Retard);
							}
						}
					}
					if (
						lColonne.Genre === EGenreRessource.Absence &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lTabInactif.push(
							EGenreRessource.Retard,
							EGenreRessource.Infirmerie,
							EGenreRessource.Exclusion,
							EGenreRessource.Punition,
							EGenreRessource.Dispense,
						);
					} else if (
						((lColonne.Genre !== EGenreRessource.Observation &&
							lColonne.getGenre() !== EGenreRessource.Dispense &&
							lColonne.getGenre() !== EGenreRessource.RepasAPreparer) ||
							lColonne.genreObservation ===
								TypeGenreObservationVS.OVS_Autres) &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lTabInactif.push(EGenreRessource.Absence);
					} else if (
						lColonne.Genre === EGenreRessource.Dispense &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lAbsence = this.aUneAbsence(aNumEleve, EGenreRessource.Dispense);
						lElementAbs = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeDispenses.get(lAbsence);
						if (!lElementAbs.presenceOblig) {
							lTabInactif.push(EGenreRessource.Absence);
							if (
								(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
									GEtatUtilisateur.GenreEspace ===
										EGenreEspace.Mobile_Professeur) &&
								lElementAbs &&
								!lElementAbs.Professeur.existeNumero() &&
								lElementAbs.estSurCours
							) {
								lTabInactif.push(EGenreRessource.Dispense);
							}
						}
						if (!lElementAbs.estSurCours) {
							lTabInactif.push(EGenreRessource.Dispense);
						}
					}
					if (
						lColonne.Genre === EGenreRessource.RepasAPreparer &&
						this.aUneAbsence(aNumEleve, lColonne.Genre) !== -1
					) {
						lAbsence = this.aUneAbsence(aNumEleve, lColonne.Genre);
						lElementAbs = this.listeEleves
							.getElementParNumero(aNumEleve)
							.ListeAbsences.get(lAbsence);
						if (
							lElementAbs.type === TTypePreparerRepas.prNonDP ||
							lElementAbs.modifiable === false
						) {
							lTabInactif.push(lColonne.Genre);
						}
					}
				}
			}
			if (this.Cours && this.Cours.estAppelVerrouille) {
				lTabInactif.push(EGenreRessource.Absence);
				lTabInactif.push(EGenreRessource.Retard);
			}
			if (!lTabInactif.includes(EGenreRessource.Infirmerie)) {
				lAbsence = this.aUneAbsence(aNumEleve, EGenreRessource.Infirmerie);
				if (
					lAbsence !== -1 &&
					this.listeEleves
						.getElementParNumero(aNumEleve)
						.ListeAbsences.get(lAbsence).Actif === false
				) {
					lTabInactif.push(EGenreRessource.Infirmerie);
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
			(aGenreAbs === EGenreRessource.Observation
				? "_" + aNumeroColonne + "_" + aGenreObs
				: "")
		);
	}
	clicCellule(event, aIsValidation, aIsMenuContext) {
		const lRegExp = new RegExp(
			`_${ObjetElement.regexCaptureNumero}_([0-9]+)(?=_abs)`,
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
				((lGenreCol === EGenreRessource.Retard &&
					!event.data.aObjet.options.suppressionRetardDeVS) ||
					!event.data.aObjet.options.suppressionAbsenceDeVS))
		) {
			return false;
		}
		let lNumAbs = null,
			lNumObs = null,
			lTypeObs = null;
		if (lGenreCol === EGenreRessource.Observation) {
			lNumObs = $(this)
				.children("div:first-child")
				.attr("id")
				.match(new RegExp(`abs_${ObjetElement.regexCaptureNumero}`))[1];
			lTypeObs = parseInt(
				$(this)
					.children("div:first-child")
					.attr("id")
					.match(/_([0-9]+)$/)[1],
			);
		}
		let lTypeSaisie = EGenreEtat.Creation;
		if ($(this).children("div:first-child").html() !== "") {
			lTypeSaisie = EGenreEtat.Suppression;
		}
		if (lGenreCol === EGenreRessource.RepasAPreparer) {
			lTypeSaisie = EGenreEtat.Modification;
		}
		if (
			!aIsValidation &&
			((lTypeSaisie === EGenreEtat.Suppression &&
				lGenreCol !== EGenreRessource.Absence &&
				lGenreCol !== EGenreRessource.Retard &&
				lTypeObs !== TypeGenreObservationVS.OVS_ObservationParent &&
				lTypeObs !== TypeGenreObservationVS.OVS_Encouragement &&
				lGenreCol !== EGenreRessource.Punition) ||
				(aIsMenuContext &&
					(lGenreCol === EGenreRessource.Punition ||
						lTypeObs === TypeGenreObservationVS.OVS_ObservationParent ||
						lTypeObs === TypeGenreObservationVS.OVS_Encouragement)) ||
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
				lTypeSaisie === EGenreEtat.Creation &&
				$(this).hasClass(event.data.aObjet.getClassCelluleDispense())
			) {
				lAUnCommentaire = lGenreCol === EGenreRessource.Absence;
			} else if (lGenreCol === EGenreRessource.Punition) {
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
						lGenreCol !== EGenreRessource.Dispense
							? "ListeAbsences"
							: "ListeDispenses"
					].get(lNumAbs);
				if (lGenreCol === EGenreRessource.Exclusion) {
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
				let lMessage = GTraductions.getValeur("AbsenceVS.msgContenu");
				if (
					lTypeSaisie === EGenreEtat.Creation &&
					$(this).hasClass(event.data.aObjet.getClassCelluleDispense())
				) {
					lMessage = lEleve.messageDispense;
				} else if (lGenreCol === EGenreRessource.Punition) {
					lMessage = GTraductions.getValeur("AbsenceVS.InfosPunitionPerdues");
				} else if (lGenreCol === EGenreRessource.Exclusion) {
					lMessage = GTraductions.getValeur("AbsenceVS.InfosExclusionPerdues");
				} else if (lGenreCol === EGenreRessource.Observation) {
					lMessage = GTraductions.getValeur("AbsenceVS.CommentaireObsPerdu");
				} else if (lGenreCol === EGenreRessource.Infirmerie) {
					lMessage = GTraductions.getValeur("AbsenceVS.CommentaireInfPerdu");
				} else if (lGenreCol === EGenreRessource.Dispense) {
					lMessage = `${lAbsence.avecDocuments ? GTraductions.getValeur("AbsenceVS.DispenseAvecCommPJ") : GTraductions.getValeur("AbsenceVS.DispenseAvecComm")} ${GTraductions.getValeur("AbsenceVS.ConfimationSuppression")}`;
				}
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: lMessage,
					callback: (aAccepte) => {
						if (!aAccepte) {
							$(this).trigger("click", [true, aIsMenuContext]);
						}
					},
				});
				return true;
			} else if (
				lGenreCol === EGenreRessource.Dispense &&
				lAbsence &&
				lAbsence.avecDocuments
			) {
				const lMessage = `${GTraductions.getValeur("AbsenceVS.DispenseAvecPJ")}<br />${GTraductions.getValeur("AbsenceVS.ConfimationSuppression")}`;
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
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
			case EGenreRessource.Observation:
			case EGenreRessource.Absence:
			case EGenreRessource.RepasAPreparer:
				if (
					lTypeObs === TypeGenreObservationVS.OVS_ObservationParent ||
					lTypeObs === TypeGenreObservationVS.OVS_Encouragement
				) {
					if (lTypeSaisie === EGenreEtat.Creation) {
						event.data.aObjet.callback.appel(
							EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
					if (!(aIsMenuContext && lTypeSaisie === EGenreEtat.Suppression)) {
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
					EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
			case EGenreRessource.Dispense: {
				const lAbsence = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
					null,
					true,
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
						EGenreEvenementSaisieAbsence.DemandesDispenseEleve,
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
					lTypeSaisie = EGenreEtat.Creation;
				}
				event.data.aObjet.callback.appel(
					EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
			case EGenreRessource.Infirmerie:
				if (lTypeSaisie === EGenreEtat.Creation) {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.Infirmerie,
						{
							numeroEleve: event.data.aObjet.numeroEleveSelectionne,
							place: event.data.aObjet.placeSaisieDebut,
							placeDebut: event.data.aObjet.placeSaisieDebut,
							placeFin: event.data.aObjet.placeSaisieFin,
						},
					);
				} else {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
			case EGenreRessource.Punition:
			case EGenreRessource.Exclusion:
				lNumAbs = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
					lNumObs,
				);
				if (lTypeSaisie === EGenreEtat.Creation) {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.PunitionSaisie,
						{ genreAbsence: lGenreCol },
					);
				} else if (lGenreCol === EGenreRessource.Exclusion) {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
						EGenreEvenementSaisieAbsence.PunitionSaisie,
						{
							genreAbsence: lGenreCol,
							numeroPunition: lNumAbs * 2 + 1,
							modification: true,
						},
					);
				} else {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.PunitionSuppression,
					);
				}
				break;
			case EGenreRessource.Retard:
				if (lTypeSaisie === EGenreEtat.Creation || aIsMenuContext) {
					event.data.aObjet.callback.appel(
						EGenreEvenementSaisieAbsence.ActionSurAbsence,
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
					(lAbsence.Genre === EGenreRessource.Absence ||
						lAbsence.Genre === EGenreRessource.Exclusion ||
						lAbsence.Genre === EGenreRessource.Infirmerie) &&
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
		if (aGenreAbs === EGenreRessource.Punition) {
			return this.aUnePunition(aNumEleve);
		}
		if (aGenreAbs === EGenreRessource.Dispense) {
			return this.aUneDispense(aNumEleve, aAvecEnseignementALaMaison);
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		for (let i = 0; !!lEleve && i < lEleve.ListeAbsences.count(); i++) {
			const lAbsence = lEleve.ListeAbsences.get(i);
			if (
				lAbsence.getEtat() !== EGenreEtat.Suppression &&
				(aGenreAbs !== EGenreRessource.Absence ||
					(lAbsence.PlaceDebut <= this.placeSaisieFin &&
						lAbsence.PlaceFin >= this.placeSaisieDebut)) &&
				((aGenreAbs === EGenreRessource.Observation &&
					lAbsence.observation &&
					lAbsence.observation.Numero === aNumAbs) ||
					(aGenreAbs !== EGenreRessource.Observation &&
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
				lAbsence.getEtat() !== EGenreEtat.Suppression &&
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
			if (lDemandeDispense.getEtat() !== EGenreEtat.Suppression) {
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
				if (aDemande.getEtat() !== EGenreEtat.Suppression) {
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
				lAbsence.getEtat() !== EGenreEtat.Suppression &&
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
					aAbsence.getEtat() !== EGenreEtat.Suppression &&
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
				lAbsence.Genre === EGenreRessource.ObservationProfesseurEleve &&
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
			aGenre !== EGenreRessource.Observation
				? this.listeColonnes.getElementParGenre(aGenre)
				: this.listeColonnes.getElementParNumero(aNumeroObservationVS);
		const lColonnesInactives = this.calculTableauColonnesInactives(aNumero);
		let lColonneNonEditable = false;
		lColonnesInactives.every((aObj) => {
			let lGenreColonne, lNumeroColonne;
			if (MethodesObjet.isNumeric(aObj)) {
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
			[EGenreRessource.Absence, EGenreRessource.Retard].includes(aGenre);
		const lAvecSaisieDefaultCarnet =
			aGenre !== EGenreRessource.Observation ||
			aGenreObservationVS !== TypeGenreObservationVS.OVS_DefautCarnet ||
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
			genreMsg: EGenreBoiteMessage.Information,
			strMsg: "",
		};
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement) {
			return lResult;
		}
		if (!aAbsence) {
			return lResult;
		}
		const lGenreAbsence = aAbsence.getGenre();
		if (
			![EGenreRessource.Absence, EGenreRessource.Retard].includes(lGenreAbsence)
		) {
			return lResult;
		}
		const lUsrConnecte = GEtatUtilisateur.Identification.getMembre();
		const lEstAbsenceSaisieParAutreProf =
			aAbsence.Professeur.getGenre() ===
				TypeGenreIndividuAuteur.GIA_Professeur &&
			aAbsence.Professeur.existeNumero() &&
			aAbsence.Professeur.getNumero() !== lUsrConnecte.getNumero();
		if (lEstAbsenceSaisieParAutreProf) {
			lResult.peutSupprimer = false;
			lResult.strMsg = GTraductions.getValeur("AbsenceVS.msgAutreProf");
			return lResult;
		}
		const lEstAbsenceSaisieParPersonnel =
			aAbsence.Professeur.getGenre() ===
				TypeGenreIndividuAuteur.GIA_Personnel &&
			aAbsence.Professeur.existeNumero();
		if (lEstAbsenceSaisieParPersonnel) {
			lResult.peutSupprimer = false;
			lResult.strMsg = GTraductions.getValeur("AbsenceVS.msgAutrePersonnel");
			return lResult;
		}
		const lEstUneSaisieVS =
			aAbsence.Professeur.getGenre() ===
			TypeGenreIndividuAuteur.GIA_Administratif;
		if (lEstUneSaisieVS) {
			const lEstAbsence = lGenreAbsence === EGenreRessource.Absence;
			lResult.peutSupprimer = lEstAbsence
				? this.autorisations.suppressionAbsenceDeVS
				: this.autorisations.suppressionRetardDeVS;
			lResult.strMessage = lResult.peutSupprimer
				? GTraductions.getValeur("AbsenceVS.msgConfimation")
				: GTraductions.getValeur("AbsenceVS.msgPasAutorise");
			lResult.genreMsg = lResult.peutSupprimer
				? EGenreBoiteMessage.Confirmation
				: EGenreBoiteMessage.Information;
			return lResult;
		}
		return lResult;
	}
	estUnSaisieVS(aAbsence) {
		const lResult =
			!!aAbsence &&
			[EGenreRessource.Absence, EGenreRessource.Retard].includes(
				aAbsence.getGenre(),
			) &&
			(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
				GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur) &&
			aAbsence.Professeur.getGenre() !==
				TypeGenreIndividuAuteur.GIA_Professeur &&
			!aAbsence.Professeur.existeNumero();
		return lResult;
	}
	getListeColonnesTriees() {
		let lListe = new ObjetListeElements();
		if (this.listeColonnes) {
			lListe = MethodesObjet.dupliquer(this.listeColonnes);
			lListe.setTri([
				ObjetTri.init((D) => {
					return D.getGenre() !== EGenreRessource.Dispense;
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
			case EGenreRessource.Absence:
			case EGenreRessource.Infirmerie:
			case EGenreRessource.Exclusion: {
				if (
					aGenreAbs === EGenreRessource.Absence &&
					!!lEleve &&
					lEleve.estDetache
				) {
					lResult = tag("i", {
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
					} else if (aGenreAbs !== EGenreRessource.Absence) {
						let lEstPubliee;
						if (aGenreAbs === EGenreRessource.Exclusion) {
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
			case EGenreRessource.RepasAPreparer:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs);
				lElementAbsence =
					lAbsence > -1 ? lEleve.ListeAbsences.get(lAbsence) : false;
				if (lElementAbsence.type !== TTypePreparerRepas.prNonDP) {
					lImageCoche =
						lElementAbsence.type === TTypePreparerRepas.prOui
							? " prevu"
							: lElementAbsence.type === TTypePreparerRepas.prNon
								? " mix-icon_remove"
								: "";
					lResult =
						lAbsence >= 0
							? '<i role="img" class="icon_food' + lImageCoche + '"></i>'
							: "";
				}
				break;
			case EGenreRessource.Observation:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs, aNumAbs);
				if (aTypeObs === null || aTypeObs === undefined) {
					aTypeObs =
						this.listeColonnes.getElementParNumero(aNumAbs).genreObservation;
				} else {
					aTypeObs = parseInt(aTypeObs);
				}
				if (lAbsence >= 0) {
					if (
						aTypeObs !== TypeGenreObservationVS.OVS_ObservationParent &&
						aTypeObs !== TypeGenreObservationVS.OVS_Encouragement
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
			case EGenreRessource.Retard:
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs);
				lTexte =
					lAbsence >= 0
						? GTraductions.getValeur("Absence.RetardDe", [
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
			case EGenreRessource.Punition: {
				const lIndicePunitionEleve = this.aUnePunition(aNumEleve);
				if (lIndicePunitionEleve >= 0) {
					const lClassesIcones = [];
					const lPunition = this.listeEleves
						.getElementParNumero(aNumEleve)
						.listePunitions.get(lIndicePunitionEleve);
					const lNaturePunition = lPunition ? lPunition.naturePunition : null;
					if (lNaturePunition) {
						switch (lNaturePunition.getGenre()) {
							case TypeGenrePunition.GP_Devoir:
								lClassesIcones.push("icon_nouveau_document");
								break;
							case TypeGenrePunition.GP_Retenues:
								lClassesIcones.push("icon_time");
								break;
							case TypeGenrePunition.GP_ExclusionCours:
							case TypeGenrePunition.GP_Autre:
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
							GDate.estAvantJour(
								lDatePublicationPunition,
								GDate.getJour(GDate.demain),
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
			case EGenreRessource.Dispense: {
				lAbsence = this.aUneAbsence(aNumEleve, aGenreAbs, null, true, true);
				const lEleveALaMaison =
					this.listeEleves.getElementParNumero(
						aNumEleve,
					).estEnseignementALaMaison;
				const lIndiceDemandeDispense = this.aUneDemandeDeDispense(aNumEleve);
				if (lAbsence >= 0 || !!lEleveALaMaison || lIndiceDemandeDispense >= 0) {
					const lHtml = [];
					lElementAbsence =
						lAbsence > -1
							? this.listeEleves
									.getElementParNumero(aNumEleve)
									.ListeDispenses.get(lAbsence)
							: false;
					const lEstVS =
						(GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
							GEtatUtilisateur.GenreEspace ===
								EGenreEspace.Mobile_Professeur) &&
						lElementAbsence &&
						!lElementAbsence.Professeur.existeNumero();
					const lDemandeDispense =
						lIndiceDemandeDispense > -1
							? this.listeEleves
									.getElementParNumero(aNumEleve)
									.listeDemandesDispense.get(lIndiceDemandeDispense)
							: false;
					if (!!lElementAbsence) {
						lHtml.push(
							`<i role="img" class="icon_ok ${lEstVS ? " mix-icon_vs i-red" : ""}"  aria-hidden="true"></i>`,
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
							`<i role="img" class="${lElementAbsence.publierPJFeuilleDAppel ? "icon_piece_jointe" : "icon_comment_vide"}${lElementAbsence.publierPJFeuilleDAppel && lElementAbsence.commentaire ? " mix-icon_comment_vide mix-i-large" : ""}"  aria-hidden="true"></i>`,
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
					GTraductions.getValeur("AbsenceVS.IndentificationDelegue");
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
			return GTraductions.getValeur("AbsenceVS.CreerUnMemo");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.creerValorisation
		) {
			return GTraductions.getValeur("AbsenceVS.CreerUnValorisation");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.supprimerEleveDuCours
		) {
			return GTraductions.getValeur("AbsenceVS.SuppressionEleve");
		} else if (aGenreCommande === this.genreCommandeMenuContextVS.modifier) {
			return GTraductions.getValeur("Modifier");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.modifierMotif
		) {
			return GTraductions.getValeur("AbsenceVS.ModifierMotifRetard");
		} else if (aGenreCommande === this.genreCommandeMenuContextVS.supprimer) {
			return GTraductions.getValeur("Supprimer");
		} else if (
			aGenreCommande === this.genreCommandeMenuContextVS.publierObservation
		) {
			return aPublie
				? GTraductions.getValeur("AbsenceVS.Depublier")
				: GTraductions.getValeur("AbsenceVS.PublierParentsEleves");
		} else {
			return "";
		}
	}
	formatTradAbs(aAbs, aGenre) {
		return ObjetMoteurAbsences.formatTraductionAbs(aAbs, aGenre);
	}
	static formatTraductionAbs(aAbs, aGenre) {
		if (!!aAbs) {
			const lDateDebut = GDate.placeAnnuelleEnDate(aAbs.PlaceDebut);
			const lDateDebutTest = new Date(lDateDebut.getTime());
			const lDateFin = GDate.placeAnnuelleEnDate(aAbs.PlaceFin, true);
			const lDateFinTest = new Date(lDateFin.getTime());
			if (
				lDateDebutTest.setHours(0, 0, 0, 0) ===
				lDateFinTest.setHours(0, 0, 0, 0)
			) {
				let lCleTraduction;
				if (aAbs.estEnseignementALaMaison) {
					lCleTraduction = "Absence.ALaMaisonLeDeA";
				} else {
					if (aGenre === EGenreRessource.Absence) {
						lCleTraduction = "Absence.AbsenceLeDeA";
					} else {
						lCleTraduction = "Absence.DispenseLeDeA";
					}
				}
				return GTraductions.getValeur(lCleTraduction, [
					GDate.formatDate(lDateDebut, "%JJ/%MM/%AAAA"),
					GDate.formatDate(
						lDateDebut,
						"%hh" + GTraductions.getValeur("Absence.TimeSep") + "%mm",
					),
					GDate.formatDate(
						lDateFin,
						"%hh" + GTraductions.getValeur("Absence.TimeSep") + "%mm",
					),
				]);
			} else {
				let lCleTraduction;
				if (aAbs.estEnseignementALaMaison) {
					lCleTraduction = "Absence.ALaMaisonDuAu";
				} else {
					if (aGenre === EGenreRessource.Absence) {
						lCleTraduction = "Absence.AbsenceDuAu";
					} else {
						lCleTraduction = "Absence.DispenseDuAu";
					}
				}
				return GTraductions.getValeur(lCleTraduction, [
					GDate.formatDate(
						lDateDebut,
						"%JJ/%MM/%AAAA %hh" +
							GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
					GDate.formatDate(
						lDateFin,
						"%JJ/%MM/%AAAA %hh" +
							GTraductions.getValeur("Absence.TimeSep") +
							"%mm",
					),
				]);
			}
		} else {
		}
	}
	getListeIconesElevePourFeuilleDAppel(aEleve) {
		const lListe = new ObjetListeElements();
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
		Object.keys(TypeIconeFeuilleDAppel).forEach((aCle) => {
			const lType = TypeIconeFeuilleDAppel[aCle];
			if (MethodesObjet.isString(lType)) {
				return;
			}
			const lElement = new ObjetElement("", null, lType);
			lElement.actif = false;
			lElement.avecEvenement = false;
			lElement.ordre = TypeIconeFeuilleDAppelUtil.getOrdreDeType(lType);
			let lParametresIconeDeType = null;
			let lEstIconeAAfficher = true;
			switch (lType) {
				case TypeIconeFeuilleDAppel.delegue:
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
				case TypeIconeFeuilleDAppel.accompagnant:
					if (aEleve.HintAccompagnants && aEleve.HintAccompagnants !== "") {
						lElement.setLibelle(aEleve.HintAccompagnants);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.projetAccompagnement:
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
				case TypeIconeFeuilleDAppel.gap:
					if (!!aEleve.faitPartieDUnGAP) {
						lElement.setLibelle(
							GTraductions.getValeur("AbsenceVS.EleveFaitPartieGAP"),
						);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.anniversaire:
					if (aEleve.anniv !== "") {
						lElement.setLibelle(aEleve.anniv);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.valorisation:
					if (!!aEleve.avecValorisation) {
						lElement.setLibelle(aEleve.infoValorisation);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.devoir:
					if (!!aEleve.devoirARendre && aEleve.devoirARendre.existeNumero()) {
						if (aEleve.devoirARendre.programmation.Genre === 1) {
							lParametresIconeDeType = { rendu: true };
						}
						lElement.setLibelle(aEleve.devoirARendre.Libelle);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.memo:
					if (!!aEleve.avecMemo) {
						lElement.setLibelle(
							GTraductions.getValeur("AbsenceVS.memosDeLaVS"),
						);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.convocationVS:
					if (avecCvPerso) {
						lElement.setLibelle(
							aEleve.listeConvocations.getElementParGenre(0).Libelle,
						);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.absencePrecedent:
					if (avecAbsencePrecedent) {
						lElement.setLibelle(aEleve.motifAbsentAuPrecedentCoursJournee);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.absenceConvocationAuto:
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
				case TypeIconeFeuilleDAppel.enseignementMaison:
					if (!!aEleve.estEnseignementALaMaison) {
						let lTitreAlaMaison = "";
						const lDispense = aEleve.ListeDispenses.getElementParGenre(
							EGenreRessource.Dispense,
						);
						lTitreAlaMaison = !!lDispense
							? this.formatTradAbs(lDispense, EGenreRessource.Dispense)
							: "";
						lElement.setLibelle(lTitreAlaMaison);
						lElement.actif = true;
					}
					break;
				case TypeIconeFeuilleDAppel.absentCoursPrecedentDuProf:
					if (IE.estMobile && aEleve.absentAuDernierCours) {
						lElement.setLibelle(aEleve.hintAbsentAuDernierCours);
						lElement.actif = !!IE.estMobile;
					}
					break;
				case TypeIconeFeuilleDAppel.usagerBusScolaire:
				case TypeIconeFeuilleDAppel.autoriseASortirSeul:
					lEstIconeAAfficher = false;
					break;
				default:
					break;
			}
			lElement.class = TypeIconeFeuilleDAppelUtil.getClassIconeDeType(
				lType,
				lParametresIconeDeType,
			);
			if (lEstIconeAAfficher) {
				lListe.addElement(lElement);
			}
		});
		lListe.setTri([ObjetTri.init("ordre")]);
		lListe.trier();
		return lListe;
	}
	async afficherMessageConfirmationAppelTermineAvecDemandeDispense() {
		return await GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur(
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
						aDemande.getEtat() !== EGenreEtat.Modification &&
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
			lEleveDeLaDemande.setEtat(EGenreEtat.Modification);
			lEleveDeLaDemande.listeDemandesDispense = new ObjetListeElements().add(
				aDemande,
			);
		}
	}
	ouvrirFenetreDemandeDispense(aElement, aCallback, aInfos = {}) {
		let lListe = aElement;
		const lEstUnObjetElement = aElement instanceof ObjetElement;
		if (lEstUnObjetElement) {
			lListe = new ObjetListeElements().add(aElement);
		}
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DemandeDispense,
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
							? GTraductions.getValeur(
									"AbsenceVS.demandeDispense.demandeDeDispenseATraiter",
								)
							: GTraductions.getValeur(
									"AbsenceVS.demandeDispense.demandesDeDispenseDesResp",
									[lListe.count()],
								),
					});
				},
			},
		);
		lFenetre.setDonnees({
			listeDemandesDispense: lListe,
			avecModificationSurListe: true,
			placeSaisieDebut: this.placeSaisieDebut,
			placeSaisieFin: this.placeSaisieFin,
		});
	}
}
module.exports = { ObjetMoteurAbsences };
