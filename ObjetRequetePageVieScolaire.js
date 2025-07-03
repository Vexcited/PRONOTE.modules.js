exports.ObjetRequetePageVieScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
class ObjetRequetePageVieScolaire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON = {
			DateDebut: aParams.DateDebut,
			DateFin: aParams.DateFin,
			periode: aParams.periode,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.recap = new ObjetListeElements_1.ObjetListeElements();
		this.listeAbsences = new ObjetListeElements_1.ObjetListeElements();
		this.autorisations = this.JSONReponse.autorisations;
		const lMessage = this.JSONReponse.message;
		const lTotaux = {
			suivi: 0,
			absence: 0,
			excluCours: 0,
			excluEtab: 0,
			infirmerie: 0,
			total: 0,
		};
		let lListeMatieres = new ObjetListeElements_1.ObjetListeElements();
		if (!lMessage) {
			this.listeAbsences =
				new ObjetDeserialiser_1.ObjetDeserialiser().listeEvenementsVS(
					this.JSONReponse.listeAbsences,
					false,
				);
			this.recap = this.initialiserRecapitulatif(
				this.JSONReponse.listeRecapitulatifs,
			);
			this.listeAbsences.parcourir(this.enrichirAbsence.bind(this));
			this.recap.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNombre() > 0 ? 1 : 2;
				}),
				ObjetTri_1.ObjetTri.init("Position"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			this.recap.trier();
			if (this.JSONReponse.Matieres) {
				lListeMatieres = this.JSONReponse.Matieres;
				lListeMatieres.parcourir(_deserialiserDuree.bind(this, lTotaux));
			}
		}
		this.callbackReussite.appel({
			listeRecapitulatifs: this.recap,
			listeAbsences: this.listeAbsences,
			autorisations: this.autorisations,
			totaux: lTotaux,
			listeMatieres: lListeMatieres,
			message: lMessage,
			commentaireAbsenceObligatoire:
				!!this.JSONReponse.commentaireAbsenceObligatoire,
			commentaireRetardObligatoire:
				!!this.JSONReponse.commentaireRetardObligatoire,
		});
	}
	creerElementRecapitulatifAbsences(aObjet) {
		const lElement = new ObjetElement_1.ObjetElement(
			"",
			undefined,
			aObjet.genre,
			aObjet.position,
			true,
		);
		lElement.genreObservation = aObjet.genreObservation;
		lElement.genreNature = aObjet.genreNature;
		lElement.Nombre = [];
		lElement.genresNaturesAR = [];
		lElement.getNombre = (aGenre) => {
			let lResult = 0;
			if (!aGenre) {
				for (const i in lElement.Nombre) {
					lResult += lElement.Nombre[i];
				}
			} else {
				lResult = lElement.Nombre[aGenre];
			}
			return lResult;
		};
		lElement.aNouvelInfo = () => {
			const lResult = false;
			if (
				![
					Enumere_Espace_1.EGenreEspace.Parent,
					Enumere_Espace_1.EGenreEspace.PrimParent,
				].includes(GEtatUtilisateur.GenreEspace)
			) {
				return false;
			}
			switch (lElement.Genre) {
				case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				case Enumere_Ressource_1.EGenreRessource.Absence:
				case Enumere_Ressource_1.EGenreRessource.Retard:
				case Enumere_Ressource_1.EGenreRessource.Punition:
					for (const i in lElement.genresNaturesAR) {
						if (lElement.Nombre[i] > 0) {
							return true;
						}
					}
					break;
				default:
					return false;
			}
			return lResult;
		};
		if (aObjet.genre === Enumere_Ressource_1.EGenreRessource.Absence) {
			lElement.nombreDemiJournees = aObjet.nombreDemiJournees;
			lElement.nombreDemiJourneesNonJustifies =
				aObjet.nombreDemiJourneesNonJustifies;
			lElement.nbrHeures = aObjet.nbrHeures;
		}
		return lElement;
	}
	initialiserRecapitulatif(aListeRecapitulatifs) {
		let lObjet;
		const lListeRecapitulatifs = new ObjetListeElements_1.ObjetListeElements();
		if (this.autorisations.observation) {
			lObjet = {
				genre: Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve,
				genreObservation:
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent,
			};
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
					{ genreObservation: lObjet.genreObservation },
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
			lObjet = {
				genre: Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve,
				genreObservation:
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
			};
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
					{ genreObservation: lObjet.genreObservation },
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
			lObjet = {
				genre: Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve,
				genreObservation:
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet,
			};
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
					{ genreObservation: lObjet.genreObservation },
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
			lObjet = {
				genre: Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve,
				genreObservation:
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres,
			};
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
					{ genreObservation: lObjet.genreObservation },
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.absence) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Absence };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			for (let i = 0; i < aListeRecapitulatifs.count(); i++) {
				const lElement = aListeRecapitulatifs.get(i);
				lObjet.nombreDemiJournees = lElement.NombreTotal;
				lObjet.nombreDemiJourneesNonJustifies = lElement.NombreNonJustifie;
				lObjet.nbrHeures = lElement.NbrHeures;
			}
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.absenceRepas) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.AbsenceRepas };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.absenceInternat) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.AbsenceInternat };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.retardInternat) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.RetardInternat };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.infirmerie) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Infirmerie };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.retard) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Retard };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.incident) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Incident };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.punition || this.autorisations.exclusion) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Punition };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.mesureConservatoire) {
			lObjet = {
				genre: Enumere_Ressource_1.EGenreRessource.MesureConservatoire,
			};
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.sanction) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Sanction };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.commission) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Commission };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		if (this.autorisations.dispense) {
			lObjet = { genre: Enumere_Ressource_1.EGenreRessource.Dispense };
			lObjet.position =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					lObjet.genre,
				);
			lListeRecapitulatifs.addElement(
				this.creerElementRecapitulatifAbsences(lObjet),
			);
		}
		lListeRecapitulatifs.trier();
		lListeRecapitulatifs.getRecapitultatifDeGenre = (aParams) => {
			const lPosition =
				Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
					aParams.genre,
				);
			const lIndice = lListeRecapitulatifs.getIndiceElementParFiltre(
				(aElement) => {
					return aElement.Position === lPosition;
				},
			);
			let lRecap;
			if (lIndice > -1) {
				lRecap = lListeRecapitulatifs.get(lIndice);
			}
			return lRecap;
		};
		return lListeRecapitulatifs;
	}
	ajoutSurRecapitulatifSelonAbsence(aListeRecapitulatifs, aAbsence) {
		const lIndice = aListeRecapitulatifs.getIndiceElementParFiltre(
			_filtreRecapitulatif.bind(this, aAbsence),
		);
		const lElement = aListeRecapitulatifs.get(lIndice);
		if (!!lElement) {
			let lIx = 0;
			if (
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence ||
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard
			) {
				if (
					!aAbsence.justifie &&
					aAbsence.avecSaisie &&
					(!aAbsence.motifParent || !aAbsence.motifParent.existeNumero()) &&
					!lElement.genresNaturesAR.includes(lIx)
				) {
					lElement.genresNaturesAR.push(lIx);
				}
				if (aAbsence.justifie) {
					lIx = 1;
				}
				if (aAbsence.estUneCreationParent) {
					lIx = 2;
				}
			}
			if (
				aAbsence.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
			) {
				if (
					!aAbsence.estLue &&
					aAbsence.avecARObservation &&
					!lElement.genresNaturesAR.includes(lIx)
				) {
					lElement.genresNaturesAR.push(lIx);
				}
				if (aAbsence.estLue || !aAbsence.avecARObservation) {
					lIx = 1;
				}
			}
			if (
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition ||
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Sanction ||
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
			) {
				if (
					aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
				) {
					lIx = !!aAbsence.mesure
						? aAbsence.mesure.getGenre()
						: !!aAbsence.etatMesure && aAbsence.etatMesure !== ""
							? aAbsence.etatMesure
							: Enumere_Ressource_1.EGenreRessource.Aucune;
				} else {
					lIx = aAbsence.nature.getGenre();
					if (
						aAbsence.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Punition &&
						aAbsence.nature.estAvecARParent &&
						!aAbsence.parentAAccuseDeReception &&
						!lElement.genresNaturesAR.includes(lIx)
					) {
						lElement.genresNaturesAR.push(lIx);
					}
				}
			}
			if (
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense
			) {
				if (!aAbsence.enAttente || aAbsence.reglee) {
					lIx = 1;
				}
			}
			if (lElement.Nombre[lIx] === undefined || lElement.Nombre[lIx] === null) {
				lElement.Nombre[lIx] = 0;
			}
			if (
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition ||
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Sanction ||
				aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
			) {
				if (!lElement.libelles) {
					lElement.libelles = [];
				}
				if (!lElement.libelles[lIx] && !aAbsence.estProgrammation) {
					if (
						aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
					) {
						lElement.libelles[lIx] = _getTraductionMesure(lIx);
					} else {
						lElement.libelles[lIx] = aAbsence.nature.getLibelle();
					}
				}
			}
			if (!aAbsence.estProgrammation) {
				lElement.Nombre[lIx]++;
			}
		}
	}
	enrichirAbsence(aElement) {
		this.ajoutSurRecapitulatifSelonAbsence(this.recap, aElement);
	}
}
exports.ObjetRequetePageVieScolaire = ObjetRequetePageVieScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"PagePresence",
	ObjetRequetePageVieScolaire,
);
function _filtreRecapitulatif(aAbsence, aElement) {
	const lObj = { genreObservation: aAbsence.genreObservation };
	if (aAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition) {
		lObj.genreNature = aAbsence.nature.getGenre();
	}
	const lPosition = Enumere_Ressource_1.EGenreRessourceUtil.getPositionAbsence(
		aAbsence.getGenre(),
		lObj,
	);
	return aElement.Position === lPosition;
}
function _getTraductionMesure(aGenre) {
	switch (aGenre) {
		case Enumere_Ressource_1.EGenreRessource.Punition:
			return ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.LieAPunition");
		case Enumere_Ressource_1.EGenreRessource.Sanction:
			return ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.LieASanction");
		case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.LieAMesureConservatoire",
			);
		case Enumere_Ressource_1.EGenreRessource.Aucune:
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.SansMesureDiciplinaire",
			);
		default:
			return aGenre;
	}
}
function _deserialiserDuree(aTotaux, aElement, aIndex, aListeOrigin) {
	if (aElement.regroupement > 0) {
		aElement.estUnDeploiement = true;
		aElement.estDeploye = true;
	}
	const lDansRegroupement = aElement.dansRegroupement;
	if (lDansRegroupement > 0) {
		const lIdxPere = aListeOrigin.getIndiceElementParFiltre((aElmOrigin) => {
			return aElmOrigin.regroupement === lDansRegroupement;
		});
		if (lIdxPere > -1) {
			aElement.pere = aListeOrigin.get(lIdxPere);
		}
	}
	aElement.total = aElement.absence + aElement.excluCours + aElement.excluEtab;
	if (!aElement.estUnDeploiement) {
		aTotaux.suivi += aElement.suivi;
		aTotaux.absence += aElement.absence;
		aTotaux.excluCours += aElement.excluCours;
		aTotaux.excluEtab += aElement.excluEtab;
		aTotaux.infirmerie += aElement.infirmerie;
		aTotaux.total += aElement.total;
	}
}
