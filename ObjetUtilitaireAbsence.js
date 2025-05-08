exports.ObjetUtilitaireAbsence = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Repas_1 = require("Enumere_Repas");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Sanction_1 = require("Enumere_Sanction");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const TypePerimetreMesureConservatoire_1 = require("TypePerimetreMesureConservatoire");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFiche_SaisieAbsence_1 = require("ObjetFiche_SaisieAbsence");
const ObjetRequeteSaisieVieScolaire_1 = require("ObjetRequeteSaisieVieScolaire");
const Toast_1 = require("Toast");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_SaisieDispense_1 = require("ObjetFenetre_SaisieDispense");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
class ObjetUtilitaireAbsence {
	constructor() {
		this.maxLengthCommentaire = 200;
	}
	getChaineTraductionGenreAbsenceTitre(aObjet) {
		if (!!aObjet.aucun) {
			switch (aObjet.genre) {
				case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
					switch (aObjet.genreObservation) {
						case TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aucuneObservation",
							);
						case TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_Encouragement:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aucunEncouragement",
							);
						case TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_DefautCarnet:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aucunDefautCarnet",
							);
						case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aucuneAutreObservation",
							);
						default:
							return "";
					}
				case Enumere_Ressource_1.EGenreRessource.Absence:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneAbsence",
					);
				case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneAbsenceRepas",
					);
				case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneAbsenceInternat",
					);
				case Enumere_Ressource_1.EGenreRessource.Retard:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucunRetard",
					);
				case Enumere_Ressource_1.EGenreRessource.Infirmerie:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucunInfirmerie",
					);
				case Enumere_Ressource_1.EGenreRessource.Incident:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucunIncident",
					);
				case Enumere_Ressource_1.EGenreRessource.Punition:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucunePunition",
					);
				case Enumere_Ressource_1.EGenreRessource.Sanction:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneSanction",
					);
				case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneMesure",
					);
				case Enumere_Ressource_1.EGenreRessource.Commission:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneCommission",
					);
				case Enumere_Ressource_1.EGenreRessource.Dispense:
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucuneDispense",
					);
				default:
					return "";
			}
		} else {
			switch (aObjet.genre) {
				case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
					if (aObjet.genreObservation !== undefined) {
						switch (aObjet.genreObservation) {
							case TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent:
								return aObjet.singulier
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.observation",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.observations",
										);
							case TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_Encouragement:
								return aObjet.singulier
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.encouragement",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.encouragements",
										);
							case TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_DefautCarnet:
								return aObjet.singulier
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.defautDeCarnet",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.defautsDeCarnet",
										);
							case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres:
								return aObjet.singulier
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.autreObservation",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.autresObservations",
										);
							default:
								return aObjet.singulier
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.observation",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.observations",
										);
						}
					}
					if (aObjet.estLue === undefined) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.observation",
						);
					}
					if (aObjet.estLue) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.observationLue",
						);
					} else {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.observationNonLue",
						);
					}
				case Enumere_Ressource_1.EGenreRessource.Absence:
					if (aObjet.justifie === undefined) {
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.absenceEnCours",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.absencesEnCours",
								);
					} else if (aObjet.justifie) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absencesRecapJust",
						);
					} else {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absencesRecapNonJust",
						);
					}
				case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absenceRepas")
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absencesRepas",
							);
				case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absenceInternat",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absencesInternat",
							);
				case Enumere_Ressource_1.EGenreRessource.Retard:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retard")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retards");
				case Enumere_Ressource_1.EGenreRessource.Infirmerie:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.infirmerie")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.infirmeries");
				case Enumere_Ressource_1.EGenreRessource.Exclusion:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.exclusion")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.exclusions");
				case Enumere_Ressource_1.EGenreRessource.Punition:
					if (aObjet.estLIncident) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.incidentPunition",
						);
					}
					if (aObjet.genreNature === undefined) {
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punition")
							: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punitions");
					}
					switch (aObjet.genreNature) {
						case TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.exclusion",
							);
						case TypeGenrePunition_1.TypeGenrePunition.GP_Retenues:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.retenue",
							);
						case TypeGenrePunition_1.TypeGenrePunition.GP_Devoir:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.devoirSuppl",
							);
						case TypeGenrePunition_1.TypeGenrePunition.GP_Autre:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.punitionAutre",
							);
						default:
							return "";
					}
				case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.mesureConservatoire",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.mesuresConservatoires",
							);
				case Enumere_Ressource_1.EGenreRessource.Sanction:
					if (!aObjet.libelle && !aObjet.genreNature) {
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanction")
							: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanctions");
					}
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanction")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanctions");
				case Enumere_Ressource_1.EGenreRessource.Incident:
					if (!aObjet.genreNature) {
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.incident")
							: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.incidents");
					}
					switch (aObjet.genreNature) {
						case Enumere_Ressource_1.EGenreRessource.Punition:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.LieAPunition",
							);
						case Enumere_Ressource_1.EGenreRessource.Sanction:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.LieASanction",
							);
						case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.LieAMesureConservatoire",
							);
						case Enumere_Ressource_1.EGenreRessource.Aucune:
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SansMesureDiciplinaire",
							);
						default:
							return "";
					}
				case Enumere_Ressource_1.EGenreRessource.Commission:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commission")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commissions");
				case Enumere_Ressource_1.EGenreRessource.Dispense:
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Dispense")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Dispenses");
				default:
					return "";
			}
		}
	}
	getCheckBoxVS(aParams) {
		const H = [];
		const lID = aParams.id ? ' id="' + aParams.id + '"' : "";
		const lIEmodel = aParams.ieModel ? " " + aParams.ieModel : "";
		if (aParams.sansLabel) {
			H.push(
				'<ie-checkbox class="theme-viescolaire colored-label"',
				lID,
				lIEmodel,
				"></ie-checkbox>",
			);
		} else {
			const lLibelle =
				aParams.label ||
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.JeSuisInformee");
			H.push(
				'<ie-checkbox class="theme-viescolaire colored-label" ie-textleft',
				lID,
				lIEmodel,
				">",
				lLibelle,
				"</ie-checkbox>",
			);
		}
		return H.join("");
	}
	getInfoAbsenceAccessible(aAbsence) {
		const H = [];
		switch (aAbsence.Genre) {
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				H.push(this.getMatiere(aAbsence, false, true));
				H.push(this.getCommentaire(aAbsence, false, false));
				break;
			case Enumere_Ressource_1.EGenreRessource.Absence:
				H.push(this.getHeuresCoursManquees(aAbsence));
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				H.push(this.getSymptomesMedicaux(aAbsence, true, false));
				H.push(this.getActesMedicaux(aAbsence, true, false));
				H.push(this.getCommentaireInfirmerie(aAbsence, true, false));
				break;
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
			case Enumere_Ressource_1.EGenreRessource.Punition:
			case Enumere_Ressource_1.EGenreRessource.Sanction:
			case Enumere_Ressource_1.EGenreRessource.Incident:
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire: {
				for (let I = 0; I < aAbsence.listeMotifs.count(); I++) {
					H.push("<span>", aAbsence.listeMotifs.getLibelle(I), "</span><br>");
				}
				if (aAbsence.circonstances) {
					H.push("<span>", aAbsence.circonstances, "</span><br>");
				}
				if (aAbsence.travailAFaire) {
					H.push(
						"<span>",
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.travailAFaire"),
						" : ",
						aAbsence.travailAFaire,
						"</span><br>",
					);
				}
				const lIndividu = this.getDemandeurDecideur(aAbsence);
				if (lIndividu) {
					H.push("<span>", lIndividu, "</span><br>");
				}
				break;
			}
			default:
				break;
		}
		return H.join("");
	}
	getInfosMotifAbsenceVS(aObjet) {
		const lMotif = {
			label: "",
			labelParent:
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Raison") + " : ",
			texte: "",
			texteParent: "",
			message: "",
			existe: function () {
				return !!this.texte;
			},
		};
		if (
			(aObjet.donnee.avecSaisie || !aObjet.donnee.reglee) &&
			aObjet.pourSaisieParent &&
			this.estEspaceParent()
		) {
			if (
				!!aObjet.donnee.motifParent &&
				aObjet.donnee.motifParent.existeNumero()
			) {
				lMotif.label = lMotif.labelParent;
				lMotif.texte = aObjet.donnee.motifParent.getLibelle();
			}
		} else {
			lMotif.label =
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.titres.motif") +
				" : ";
		}
		if (aObjet.donnee.message && this.estEspaceParent()) {
			lMotif.message = aObjet.donnee.message;
		}
		if (
			aObjet.donnee.reglee ||
			(aObjet.donnee.listeMotifs && aObjet.donnee.listeMotifs.count() > 0)
		) {
			if (
				this.estEspaceParent() &&
				!!aObjet.donnee.motifParent &&
				aObjet.donnee.motifParent.existeNumero()
			) {
				lMotif.texteParent = aObjet.donnee.motifParent.getLibelle();
			}
			lMotif.texte = aObjet.donnee.listeMotifs.getTableauLibelles().join(", ");
			if (aObjet.donnee.reglee && aObjet.donnee.listeMotifs.count() === 0) {
				lMotif.texte = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.sansMotif",
				).ucfirst();
			}
			if (
				(aObjet.donnee.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Absence ||
					aObjet.donnee.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Retard) &&
				!aObjet.donnee.justifie &&
				!aObjet.donnee.enAttente
			) {
				if (lMotif.texte) {
					lMotif.texte +=
						" (" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.sansRaisonValable",
						) +
						")";
				} else {
					lMotif.texte = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.sansRaisonValable",
					).ucfirst();
				}
			}
		}
		return lMotif;
	}
	getMotifAbsence(aObjet) {
		let lTitle = "";
		let lResult = "";
		let lMotif = "";
		if (
			aObjet.donnee.reglee ||
			(aObjet.donnee.listeMotifs && aObjet.donnee.listeMotifs.count() > 0)
		) {
			if (this.estEspaceParent() && aObjet.donnee.message && aObjet.enListe) {
				lTitle =
					'ie-hint="' +
					(aObjet.donnee.message.replace
						? aObjet.donnee.message.replace(/\n/g, "<br />")
						: aObjet.donnee.message) +
					'"';
			}
			lMotif = aObjet.donnee.listeMotifs.getTableauLibelles().join(", ");
			if (aObjet.donnee.reglee && aObjet.donnee.listeMotifs.count() === 0) {
				lMotif = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.sansMotif",
				).ucfirst();
			}
			if (
				(aObjet.donnee.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Absence ||
					aObjet.donnee.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Retard) &&
				!aObjet.donnee.justifie &&
				!aObjet.donnee.enAttente
			) {
				if (lMotif) {
					lMotif +=
						" (" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.sansRaisonValable",
						) +
						")";
				} else {
					lMotif = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.sansRaisonValable",
					).ucfirst();
				}
			}
			lResult =
				!aObjet.enListe || aObjet.editable === false
					? lMotif
					: '<div class="PetitEspace' +
						(lTitle && aObjet.classe ? " " + aObjet.classe : "") +
						'" ' +
						lTitle +
						">" +
						lMotif +
						"</div>";
			if (!aObjet.enListe && aObjet.donnee.message && this.estEspaceParent()) {
				lResult +=
					'<div class="Texte10 Italique EspaceHaut">' +
					aObjet.donnee.message +
					"</div>";
			}
			return lResult;
		}
		if (
			!this.estEspaceParent() ||
			![
				Enumere_Ressource_1.EGenreRessource.Absence,
				Enumere_Ressource_1.EGenreRessource.Retard,
			].includes(aObjet.donnee.getGenre())
		) {
			return "";
		}
		return lResult;
	}
	getHeuresCoursManquees(aElement, aSansSpan) {
		if (!aElement.NbrHeures || aElement.NbrHeures === "0h00") {
			return "";
		}
		let lTrad = "";
		if (parseInt(aElement.NbrHeures.charAt(0)) < 2) {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heureCoursManque",
				[aElement.NbrHeures],
			);
		} else {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heuresCoursManquees",
				[aElement.NbrHeures],
			);
		}
		if (aSansSpan) {
			return lTrad;
		}
		return "<span>" + lTrad + "</span><br>";
	}
	getHeuresCoursManqueesBulletin(aElement) {
		if (!aElement.nbrHeures || aElement.nbrHeures === "0h00") {
			return "";
		}
		let lTrad = "";
		const lArray = aElement.nbrHeures.split("h");
		if (parseInt(lArray[0]) < 2) {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heureCoursManque",
				[aElement.nbrHeures],
			);
		} else {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heuresCoursManquees",
				[aElement.nbrHeures],
			);
		}
		return lTrad;
	}
	getXAbsencesNonJustifiees(aNombreAbsencesNonJustifiees) {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aNombreAbsencesNonJustifiees) &&
			aNombreAbsencesNonJustifiees > 0
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.absenceNonjustifiees",
				[aNombreAbsencesNonJustifiees],
			);
		}
		return "";
	}
	getXDispensesEnAttente(aNombreDispenseEnAttente) {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aNombreDispenseEnAttente) &&
			aNombreDispenseEnAttente > 0
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.dispenseEnAttente",
				[aNombreDispenseEnAttente],
			);
		}
		return "";
	}
	getDontXObservationsNonLu(aNombreNonLu) {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aNombreNonLu) &&
			aNombreNonLu > 0
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.obs_Encouragements_NonLus",
				[aNombreNonLu],
			);
		}
		return "";
	}
	getDontXRetardNonJustifies(aNombreRetardsNonJustifies) {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aNombreRetardsNonJustifies) &&
			aNombreRetardsNonJustifies > 0
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.retardNonjustifies",
				[aNombreRetardsNonJustifies],
			);
		}
		return "";
	}
	getDontXNonJustifiees(aNombreAbsencesNonJustifiees) {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aNombreAbsencesNonJustifiees) &&
			aNombreAbsencesNonJustifiees > 0
		) {
			if (aNombreAbsencesNonJustifiees === 1) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.Dont1AbsenceNonJustifiee",
					[aNombreAbsencesNonJustifiees],
				);
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.DontXAbsenceNonJustifiee",
					[aNombreAbsencesNonJustifiees],
				);
			}
		}
		return "";
	}
	getDemiJourneesBulletin(aElement) {
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(aElement.nombreDemiJournees) ||
			aElement.nombreDemiJournees <= 0
		) {
			return "";
		}
		let lResult = "";
		const lCleTraduction =
			aElement.nombreDemiJournees > 1
				? "AbsenceVS.demiJournees"
				: "AbsenceVS.demiJournee";
		lResult = ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
			aElement.nombreDemiJournees,
		]);
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(
				aElement.nombreDemiJourneesNonJustifies,
			) &&
			aElement.nombreDemiJourneesNonJustifies > 0
		) {
			lResult +=
				" (" +
				this.getDontXNonJustifiees(aElement.nombreDemiJourneesNonJustifies) +
				")";
		}
		return lResult;
	}
	getDemiJourneesNonJustifiesBulletin(aElement) {
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(
				aElement.nombreDemiJourneesNonJustifies,
			) ||
			aElement.nombreDemiJourneesNonJustifies <= 0
		) {
			return "";
		}
		const lCleTraduction =
			aElement.nombreDemiJournees > 1
				? "AbsenceVS.demiJourneesNJ"
				: "AbsenceVS.demiJourneeNJ";
		return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
			aElement.nombreDemiJournees,
		]);
	}
	getDemiJournees(aElement, aSansSpan) {
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(aElement.NbrJours) ||
			aElement.NbrJours <= 0
		) {
			return "";
		}
		const lCleTraduction =
			aElement.NbrJours > 1
				? "AbsenceVS.demiJournees"
				: "AbsenceVS.demiJournee";
		if (aSansSpan) {
			return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
				aElement.NbrJours,
			]);
		}
		return (
			"<span>" +
			ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
				aElement.NbrJours,
			]) +
			"</span><br>"
		);
	}
	getSymptomesMedicauxVS(aElement) {
		const lResult = {
			label: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.titres.symptMedicaux",
			),
			texte: "",
			tohtml: function () {
				if (this.texte) {
					return (
						'<div><span class="labelVS">' +
						this.label.ucfirst() +
						' : </span><span class="colorVS">' +
						this.texte +
						"</span></div>"
					);
				} else {
					return "";
				}
			},
			toAria: function () {
				if (this.texte) {
					return this.label + " : " + this.texte + ".";
				} else {
					return "";
				}
			},
		};
		if (!!aElement.symptomesMedicaux) {
			lResult.texte = aElement.symptomesMedicaux
				.getTableauLibelles()
				.join(", ");
		}
		return lResult;
	}
	getActesMedicauxVS(aElement) {
		const lResult = {
			label: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.titres.actesMedicaux",
			),
			texte: "",
			tohtml: function () {
				if (this.texte) {
					return (
						'<div><span class="labelVS">' +
						this.label.ucfirst() +
						' : </span><span class="colorTexte">' +
						this.texte +
						"</span></div>"
					);
				} else {
					return "";
				}
			},
			toAria: function () {
				if (this.texte) {
					return this.label + " : " + this.texte + ".";
				} else {
					return "";
				}
			},
		};
		if (!!aElement.actesMedicaux) {
			lResult.texte = aElement.actesMedicaux.getTableauLibelles().join(", ");
		}
		return lResult;
	}
	getCommentaireInfirmerieVS(aElement) {
		const lResult = {
			label: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.titres.commentaire",
			),
			texte: "",
			tohtml: function () {
				if (this.texte) {
					return (
						'<div><span class="labelVS">' +
						this.label.ucfirst() +
						' : </span><span class="colorTexte">' +
						this.texte +
						"</span></div>"
					);
				} else {
					return "";
				}
			},
			toAria: function () {
				if (this.texte) {
					return this.label + " : " + this.texte + ".";
				} else {
					return "";
				}
			},
		};
		if (!!aElement.commentaire) {
			lResult.texte = aElement.commentaire;
		}
		return lResult;
	}
	getSymptomesMedicaux(aElement, aAvecLibelle, aSansSpan) {
		if (!aElement.symptomesMedicaux) {
			return "";
		}
		const lResult =
			(aAvecLibelle
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.symptMedicaux",
					).ucfirst() + " : "
				: "") + aElement.symptomesMedicaux.getTableauLibelles().join(", ");
		if (aSansSpan) {
			return lResult;
		}
		return "<span>" + lResult + "</span><br>";
	}
	getActesMedicaux(aElement, aAvecLibelle, aSansSpan) {
		if (!aElement.symptomesMedicaux) {
			return "";
		}
		const lResult =
			(aAvecLibelle
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.actesMedicaux",
					).ucfirst() + " : "
				: "") + aElement.actesMedicaux.getTableauLibelles().join(", ");
		if (aSansSpan) {
			return lResult;
		}
		return "<span>" + lResult + "</span><br>";
	}
	getCommentaireInfirmerie(aElement, aAvecLibelle, aSansSpan) {
		if (!aElement.commentaire) {
			return "";
		}
		const lResult =
			(aAvecLibelle
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.commentaire",
					).ucfirst() + " : "
				: "") + aElement.commentaire;
		if (aSansSpan) {
			return lResult;
		}
		return "<span>" + lResult + "</span><br>";
	}
	getMatiere(aElement, aSansSpan, aSansDate) {
		if (!aElement.matiere || !aElement.matiere.existeNumero()) {
			return "";
		}
		let lResult = aElement.matiere.getLibelle();
		if (
			aElement.dateDebut &&
			aElement.dateDebut.getHours() !== 0 &&
			!aSansDate
		) {
			lResult +=
				" " +
				ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
					ObjetDate_1.GDate.formatDate(aElement.dateDebut, "%xh%sh%mm"),
				]) +
				" ";
		}
		if (aSansSpan) {
			return lResult;
		}
		return "<span>" + lResult + "</span><br>";
	}
	getCommentaire(aElement, aAvecLibelle, aSansSpan) {
		if (!aElement.commentaire) {
			return "";
		}
		const lResult =
			(aAvecLibelle
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.observation",
					).ucfirst() + " : "
				: "") + aElement.commentaire;
		if (aSansSpan) {
			return lResult;
		}
		return "<span>" + lResult + "</span><br>";
	}
	getCirconstances(aElement) {
		let lCirconstance = "";
		if (!!aElement.circonstances) {
			lCirconstance = aElement.circonstances;
		}
		const lCirconstanceDoc = [];
		if (!!aElement.documentsCirconstances) {
			aElement.documentsCirconstances.parcourir((D) => {
				lCirconstanceDoc.push(
					'<span class="vsDoc">' +
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: D,
							genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						}) +
						"</span>",
				);
			});
		}
		return (
			lCirconstance +
			(!!lCirconstance && !!lCirconstanceDoc.length
				? '<div class="vsDoc">'
				: "") +
			lCirconstanceDoc.join(", ") +
			(!!lCirconstance && !!lCirconstanceDoc.length ? "</div>" : "")
		);
	}
	eventApresFiche(aElementOrig, aParams) {
		if (!!aParams && aParams.element) {
			aElementOrig.motifParent = aParams.element.motifParent;
			if (aElementOrig.motifParent) {
				aElementOrig.motifParent.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				aElementOrig.aRegulariser = false;
			}
			aElementOrig.documents = aParams.element.documents;
			aElementOrig.justification = aParams.element.justification;
			aElementOrig.setEtat(aParams.element.Etat);
			const lRequete =
				new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(this);
			if (aParams.documents && aParams.documents.count() > 0) {
				lRequete.addUpload({ listeFichiers: aParams.documents });
			}
			lRequete
				.lancerRequete({ listeAbsences: this.donnees.listeAbsences })
				.then((aReponse) => {
					if (
						!aReponse.genreReponse ||
						aReponse.genreReponse ===
							ObjetRequeteJSON_1.EGenreReponseSaisie.succes
					) {
						if ("fiche" in this && this.fiche) {
							this.fiche.fermer(false);
						}
						if (
							aElementOrig.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
						) {
							this.majAbsenceApresSaisie(aElementOrig, aReponse);
						}
						if ("objDonneesDuRecap" in this && !!this.objDonneesDuRecap) {
							this.getInstance(this.identListeDetails).setDonnees(
								this.objDonneesDuRecap,
							);
						}
						Toast_1.Toast.afficher({
							msg:
								aElementOrig.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.message.supression",
										)
									: aElementOrig.estUneCreationParent
										? ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.message.confirmerDeclaration",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.message.justification",
											),
							type: Toast_1.ETypeToast.succes,
						});
						if ("retourAccueil" in this && this.retourAccueil) {
							if (IE.estMobile) {
								const lEtatUtilisateurSco = GApplication.getEtatUtilisateur();
								const lOngletRetour =
									lEtatUtilisateurSco.SaisieAbsence &&
									lEtatUtilisateurSco.SaisieAbsence.ongletProvenance
										? lEtatUtilisateurSco.SaisieAbsence.ongletProvenance
										: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif;
								lEtatUtilisateurSco.SaisieAbsence = {};
								GInterface.evenementSurOnglet(lOngletRetour);
							} else {
								GInterface.retourSurNavigation({
									ignorerHistorique: true,
									onglet: GEtatUtilisateur.getGenreOnglet(),
								});
							}
						} else if (aParams.callback) {
							aParams.callback.call();
						}
					}
				});
		}
	}
	_majAbsenceApresSaisie(aAbsenceOrig, aAbsenceSaisie) {
		aAbsenceOrig.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
		if (aAbsenceOrig.motifParent) {
			aAbsenceOrig.motifParent.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
		}
		const lClassName =
			MethodesObjet_1.MethodesObjet.getObjectClass(aAbsenceSaisie);
		if (
			aAbsenceSaisie &&
			lClassName &&
			lClassName === "ObjetElement" &&
			aAbsenceSaisie.getNumero() === aAbsenceOrig.getNumero()
		) {
			if (aAbsenceSaisie.message) {
				aAbsenceOrig.message = aAbsenceSaisie.message;
				if (aAbsenceOrig.infosMotif) {
					aAbsenceOrig.infosMotif.message = aAbsenceOrig.message;
				}
			}
			if (aAbsenceSaisie.documents) {
				aAbsenceOrig.documents = aAbsenceSaisie.documents;
			}
		}
	}
	getDonneesAAfficher(aObjet) {
		if (!aObjet.recapitulatif) {
			return null;
		}
		const lResult = {
			recapitulatif: aObjet.recapitulatif,
			donnees: new ObjetListeElements_1.ObjetListeElements(),
			genre: aObjet.recapitulatif.getGenre(),
			genreObservation: aObjet.recapitulatif.genreObservation || undefined,
			utilitaireAbsence: this.utilitaireAbsence,
			autorisations: this.donnees.autorisations,
		};
		lResult.donnees = this.donnees.listeAbsences.getListeElements(
			(aElement) => {
				const lTestGenre =
					aElement.getGenre() === aObjet.recapitulatif.getGenre();
				const lTestGenreObservation =
					aElement.getGenre() !==
						Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve ||
					aElement.genreObservation === aObjet.recapitulatif.genreObservation;
				const lTestProg =
					aElement.getGenre() !==
						Enumere_Ressource_1.EGenreRessource.Punition ||
					aElement.estProgrammation !== true;
				return lTestGenre && lTestGenreObservation && lTestProg;
			},
		);
		const lTris = [];
		if (
			aObjet.recapitulatif.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve &&
			aObjet.recapitulatif.genreObservation ===
				TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres
		) {
			lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		}
		if (
			aObjet.recapitulatif.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Punition
		) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"dateDemande",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		} else {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"dateDebut",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		}
		lTris.push(ObjetTri_1.ObjetTri.init("Genre"));
		if (
			aObjet.recapitulatif.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.AbsenceRepas
		) {
			lTris.push(ObjetTri_1.ObjetTri.init("genreRepas"));
		}
		lResult.donnees.setTri(lTris);
		lResult.donnees.trier();
		return lResult;
	}
	remplirContentHtml(aObjet) {
		aObjet.element.infosDate = this.getInfosDate({
			element: aObjet.element,
			sansChaineAujourdhui: true,
		});
		switch (aObjet.genre) {
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				this._remplirInfosObservations(
					aObjet.element,
					aObjet.genreObservation,
					aObjet.node,
					aObjet.model,
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Absence:
				this._remplirInfosAbsences(aObjet.element, {
					avecDetailEdition: true,
					pourParent: aObjet.pourParent,
					avecBascule: aObjet.avecBascule,
					avecSaisie: aObjet.avecSaisie,
					node: aObjet.node,
					nodeEdition: aObjet.nodeEdition,
					ieHintPJ: aObjet.ieHintPJ,
					ieHintCommentaire: aObjet.ieHintCommentaire,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				this._remplirInfosAbsences(aObjet.element, {});
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				this._remplirInfosAbsences(aObjet.element, {});
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				this._remplirInfosInfirmerie(aObjet.element);
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				this._remplirInfosAbsences(aObjet.element, {
					avecDetailEdition: true,
					pourParent: aObjet.pourParent,
					avecBascule: aObjet.avecBascule,
					avecSaisie: aObjet.avecSaisie,
					node: aObjet.node,
					nodeEdition: aObjet.nodeEdition,
					ieHintPJ: aObjet.ieHintPJ,
					ieHintCommentaire: aObjet.ieHintCommentaire,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Incident:
				this._remplirInfosIncident(aObjet.element, aObjet.model);
				break;
			case Enumere_Ressource_1.EGenreRessource.Punition:
				this._remplirInfosPunition(aObjet.element, aObjet.model);
				break;
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				this._remplirInfosSanction(aObjet.element);
				break;
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				this._remplirInfosMesuresConservatoire(aObjet.element);
				break;
			default:
				break;
		}
	}
	getDemandeurDecideur(aElement, aAvecTitre, aAvecDate) {
		let lResult = "";
		if (
			aElement.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
		) {
			if (aAvecTitre) {
				lResult =
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.saisiepar",
					) + " ";
			}
			return (
				'<div class="AlignementHaut InlineBlock">' +
				lResult +
				aElement.demandeur.getLibelle() +
				"&nbsp;</div>"
			);
		}
		let lCleTraduction = "AbsenceVS.decidePar";
		let lDate = "";
		if (aAvecDate) {
			lCleTraduction = "AbsenceVS.decideLePar";
			lDate = ObjetDate_1.GDate.formatDate(aElement.dateDebut, "%J %MMM");
		}
		let lIndividu = null;
		if (aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition) {
			if (aAvecDate) {
				lCleTraduction = "AbsenceVS.demandeeLePar";
				lDate = ObjetDate_1.GDate.formatDate(aElement.dateDemande, "%J %MMM");
			} else {
				lCleTraduction = "AbsenceVS.demandePar";
			}
			lIndividu = aElement.demandeur;
		} else if (
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
		) {
			lIndividu = aElement.rapporteur;
		} else {
			lIndividu = aElement.decideur;
		}
		if (!lIndividu || !lIndividu.existeNumero()) {
			return lResult;
		}
		lResult += lIndividu.getLibelle();
		if (
			lIndividu.getGenre() !==
			TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel
		) {
			lResult +=
				" (" +
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.titres.professeur",
				).ucfirst() +
				")";
		}
		if (aAvecTitre && lResult) {
			if (aAvecDate) {
				lResult = ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
					lDate,
					lResult,
				]);
			} else {
				lResult = ObjetTraduction_1.GTraductions.getValeur(lCleTraduction, [
					lResult,
				]);
			}
		}
		return lResult;
	}
	getDate(aElement, aAvecChaineAujourdhui, aSansDate) {
		const lEstJourEgal =
			!(aElement.dateDebut && aElement.dateFin) ||
			ObjetDate_1.GDate.estJourEgal(aElement.dateDebut, aElement.dateFin);
		const lSansDate = aSansDate === true && lEstJourEgal;
		let lDateDebut = !!aElement.dateDebut
			? ObjetDate_1.GDate.formatDate(
					aElement.dateDebut,
					lEstJourEgal
						? aAvecChaineAujourdhui
							? "[" +
								ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
									"%J %MMM",
								]) +
								"]"
							: ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
									"%J %MMM",
								])
						: aElement.ouverte
							? ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
									"%J %MMM",
								])
							: ObjetTraduction_1.GTraductions.getValeur("Dates.DuDate", [
									"%J %MMM",
								]),
				)
			: "";
		const lDateFin = !!aElement.dateFin
			? ObjetDate_1.GDate.formatDate(aElement.dateFin, "%J %MMM")
			: "";
		let lHeureDebut = !!aElement.dateDebut
			? ObjetDate_1.GDate.formatDate(aElement.dateDebut, "%xh%sh%mm")
			: "";
		const lHeureFin = !!aElement.dateFin
			? ObjetDate_1.GDate.formatDate(aElement.dateFin, "%xh%sh%mm")
			: "";
		let lPlace = aElement.place;
		switch (aElement.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				return (
					lDateDebut +
					" " +
					(aElement.genreRepas === Enumere_Repas_1.EGenreRepas.Midi
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.amidi")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ausoir"))
				);
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				if (aElement.dateDebut.getHours() === 0) {
					return lDateDebut;
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DateDebutAHeureDebut",
						[lDateDebut, lHeureDebut],
					);
				}
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
			case Enumere_Ressource_1.EGenreRessource.Absence:
				if (aElement.ouverte) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DepuisDateAHeure",
						[lDateDebut, lHeureDebut],
					);
				}
				if (lEstJourEgal) {
					return (
						(lSansDate ? "" : lDateDebut + " ") +
						ObjetTraduction_1.GTraductions.getValeur(
							"Dates.DeHeureDebutAHeureFin",
							[lHeureDebut, lHeureFin],
						)
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DateDebutAHeureDebutAuDateFinAHeureFin",
					[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
				);
			case Enumere_Ressource_1.EGenreRessource.Incident:
			case Enumere_Ressource_1.EGenreRessource.Retard:
				if (lSansDate) {
					return ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
						lHeureDebut,
					]);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DateDebutAHeureDebut",
						[lDateDebut, lHeureDebut],
					);
				}
			case Enumere_Ressource_1.EGenreRessource.Punition: {
				let lResult = "";
				lPlace = aElement.placeDemande;
				if (aElement.horsCours) {
					lPlace = null;
				}
				let lFormatDate = ObjetTraduction_1.GTraductions.getValeur(
					"Dates.LeDate",
					["%J %MMM"],
				);
				if (aAvecChaineAujourdhui !== false) {
					lFormatDate = "[" + lFormatDate + "]";
				}
				lDateDebut = ObjetDate_1.GDate.formatDate(
					aElement.dateDemande,
					lFormatDate,
				);
				if (lPlace !== null && lPlace !== undefined) {
					const lDate = ObjetDate_1.GDate.placeAnnuelleEnDate(lPlace);
					if (
						lDate &&
						ObjetDate_1.GDate.estDateValide(lDate) &&
						ObjetDate_1.GDate.estJourEgal(lDate, aElement.dateDemande)
					) {
						lResult =
							ObjetTraduction_1.GTraductions.getValeur(
								"Dates.DateDebutAHeureDebut",
								[lDateDebut, ObjetDate_1.GDate.formatDate(lDate, "%xh%sh%mm")],
							) + " ";
					} else {
						lResult = lDateDebut;
					}
				} else {
					lResult = lDateDebut;
				}
				return lResult;
			}
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				if (lEstJourEgal) {
					return lDateDebut;
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DateDebutAuDateFin",
					[lDateDebut, lDateFin],
				);
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DateDebutAHeureDebutAuDateFinAHeureFin",
					[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
				);
			case Enumere_Ressource_1.EGenreRessource.Commission:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DateDebutAHeureDebut",
					[lDateDebut, lHeureDebut],
				);
			case Enumere_Ressource_1.EGenreRessource.Dispense: {
				let lResult = "";
				if (lEstJourEgal) {
					lResult =
						(lSansDate ? "" : lDateDebut + " ") +
						ObjetTraduction_1.GTraductions.getValeur(
							"Dates.DeHeureDebutAHeureFin",
							[lHeureDebut, lHeureFin],
						);
				} else {
					lResult = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DateDebutAHeureDebutAuDateFinAHeureFin",
						[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
					);
				}
				return lResult;
			}
			default:
				return "";
		}
	}
	getInfosDate(aParams) {
		const lResult = {
			date: "",
			heure: "",
			dateDebut: "",
			dateFin: "",
			heureDebut: "",
			heureFin: "",
			estJourEgal:
				!(aParams.element.dateDebut && aParams.element.dateFin) ||
				ObjetDate_1.GDate.estJourEgal(
					aParams.element.dateDebut,
					aParams.element.dateFin,
				),
			strDate: function () {
				return this.date.ucfirst();
			},
		};
		let lFormatDateDebut = "[%JJJ %J %MMM]";
		if (aParams.sansChaineAujourdhui) {
			lFormatDateDebut = "%JJJ %J %MMM";
		}
		if (aParams.avecTraduction) {
			lFormatDateDebut = lResult.estJourEgal
				? !aParams.sansChaineAujourdhui
					? "[" +
						ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
							"%J %MMM",
						]) +
						"]"
					: ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
							"%J %MMM",
						])
				: aParams.element.ouverte
					? ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
							"%J %MMM",
						])
					: ObjetTraduction_1.GTraductions.getValeur("Dates.DuDate", [
							"%J %MMM",
						]);
		}
		lResult.dateDebut = !!aParams.element.dateDebut
			? ObjetDate_1.GDate.formatDate(
					aParams.element.dateDebut,
					lFormatDateDebut,
				)
			: "";
		lResult.dateFin = !!aParams.element.dateFin
			? ObjetDate_1.GDate.formatDate(aParams.element.dateFin, "%J %MMM")
			: "";
		lResult.heureDebut = !!aParams.element.dateDebut
			? ObjetDate_1.GDate.formatDate(aParams.element.dateDebut, "%xh%sh%mm")
			: "";
		lResult.heureFin = !!aParams.element.dateFin
			? ObjetDate_1.GDate.formatDate(aParams.element.dateFin, "%xh%sh%mm")
			: "";
		let lPlace = aParams.element.place;
		switch (aParams.element.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				lResult.heure =
					aParams.element.genreRepas === Enumere_Repas_1.EGenreRepas.Midi
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.amidi")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ausoir");
				lResult.date = lResult.dateDebut + " " + lResult.heure;
				break;
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				if (aParams.element.dateDebut.getHours() === 0) {
					lResult.date = lResult.dateDebut;
				} else {
					lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.AHeure",
						[lResult.heureDebut],
					);
					lResult.date = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DateDebutAHeureDebut",
						[lResult.dateDebut, lResult.heureDebut],
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
			case Enumere_Ressource_1.EGenreRessource.Absence:
				if (aParams.element.ouverte) {
					lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.AHeure",
						[lResult.heureDebut],
					);
					lResult.date = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DepuisDateAHeure",
						[lResult.dateDebut.toLowerCase(), lResult.heureDebut],
					);
				} else if (lResult.estJourEgal) {
					lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DeHeureDebutAHeureFin",
						[lResult.heureDebut, lResult.heureFin],
					);
					lResult.date = lResult.dateDebut + " " + lResult.heure;
				} else {
					lResult.date = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
						[
							lResult.dateDebut,
							lResult.heureDebut,
							lResult.dateFin,
							lResult.heureFin,
						],
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Incident:
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
					"Dates.AHeure",
					[lResult.heureDebut],
				);
				lResult.date = ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DateDebutAHeureDebut",
					[lResult.dateDebut, lResult.heureDebut],
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Punition: {
				lPlace = aParams.element.placeDemande;
				if (aParams.element.horsCours) {
					lPlace = null;
				}
				let lFormatDate = "%JJJ %J %MMM";
				if (aParams.sansChaineAujourdhui !== true) {
					lFormatDate = "[" + lFormatDate + "]";
				}
				lResult.date = ObjetDate_1.GDate.formatDate(
					aParams.element.dateDemande,
					lFormatDate,
				);
				if (lPlace !== null && lPlace !== undefined) {
					const lDate = ObjetDate_1.GDate.placeAnnuelleEnDate(lPlace);
					if (
						lDate &&
						ObjetDate_1.GDate.estDateValide(lDate) &&
						ObjetDate_1.GDate.estJourEgal(lDate, aParams.element.dateDemande)
					) {
						lResult.date =
							ObjetTraduction_1.GTraductions.getValeur(
								"Dates.DateDebutAHeureDebut",
								[
									lResult.date,
									ObjetDate_1.GDate.formatDate(lDate, "%xh%sh%mm"),
								],
							) + " ";
					}
				}
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				if (lResult.estJourEgal) {
					lResult.date = lResult.dateDebut;
				} else {
					lResult.date = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DateDebutAuDateFin",
						[lResult.dateDebut, lResult.dateFin],
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
					"Dates.AHeure",
					[lResult.heureDebut],
				);
				lResult.date = ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
					[
						lResult.dateDebut,
						lResult.heureDebut,
						lResult.dateFin,
						lResult.heureFin,
					],
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Dispense:
				if (lResult.estJourEgal) {
					lResult.heure = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DeHeureDebutAHeureFin",
						[lResult.heureDebut, lResult.heureFin],
					);
					lResult.date = lResult.dateDebut + " " + lResult.heure;
				} else {
					lResult.date = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
						[
							lResult.dateDebut,
							lResult.heureDebut,
							lResult.dateFin,
							lResult.heureFin,
						],
					);
				}
				break;
			default:
				break;
		}
		return lResult;
	}
	getDureeDAbsence(aAbsence) {
		if (aAbsence.Genre === Enumere_Ressource_1.EGenreRessource.Retard) {
			return aAbsence.duree;
		} else {
			if (MethodesObjet_1.MethodesObjet.isString(aAbsence.duree)) {
				return aAbsence.duree;
			}
			if (MethodesObjet_1.MethodesObjet.isDate(aAbsence.duree)) {
				return ObjetDate_1.GDate.formatDate(aAbsence.duree, "%xh%sh%mm ");
			}
			if (MethodesObjet_1.MethodesObjet.isNumber(aAbsence.duree)) {
				return ObjetDate_1.GDate.formatDureeEnMillisecondes(
					UtilitaireDuree_1.TUtilitaireDuree.minEnMs(aAbsence.duree),
				);
			}
		}
		return aAbsence.duree;
	}
	getDureeSanction(aAbsence) {
		const H = [];
		let lNombre = 0;
		if (
			Enumere_Sanction_1.EGenreSanctionUtil.estUneExclusionTemporaire(
				aAbsence.nature.getGenre(),
			)
		) {
			lNombre = aAbsence.duree;
			let lCleTraduction;
			if (
				aAbsence.nature.getGenre() ===
				Enumere_Sanction_1.EGenreSanction.ExclusionInternat
			) {
				lCleTraduction = lNombre > 1 ? "AbsenceVS.nuits" : "AbsenceVS.nuit";
			} else {
				lCleTraduction = lNombre > 1 ? "AbsenceVS.jours" : "AbsenceVS.jour";
			}
			H.push(
				"&nbsp;",
				lNombre,
				"&nbsp;",
				ObjetTraduction_1.GTraductions.getValeur(lCleTraduction),
			);
			if (aAbsence.estDemiJournee) {
				H.push(
					" (" +
						(aAbsence.estMatin
							? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin")
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.apresMidi",
								)) +
						")",
				);
			}
			if (aAbsence.avecSursis) {
				if (aAbsence.dureeSursis > 0) {
					H.push(
						" ",
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.dont"),
						" ",
						aAbsence.dureeSursis,
						" ",
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.avecSursis"),
					);
					if (aAbsence.dateFinSursis) {
						H.push(
							ObjetDate_1.GDate.formatDate(
								aAbsence.dateFinSursis,
								" " +
									ObjetTraduction_1.GTraductions.getValeur("jusquAu") +
									" %J %MMM",
							),
						);
					}
				} else {
					H.push(
						" ",
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.avecSursis"),
					);
				}
			}
		} else if (
			aAbsence.nature.getGenre() ===
			Enumere_Sanction_1.EGenreSanction.Responsabilisation
		) {
			lNombre = aAbsence.duree;
			const lCleTraduction =
				lNombre > 1 ? "AbsenceVS.heures" : "AbsenceVS.heure";
			H.push(
				"&nbsp;",
				lNombre,
				"&nbsp;",
				ObjetTraduction_1.GTraductions.getValeur(lCleTraduction).toLowerCase(),
			);
		} else if (
			aAbsence.nature.getGenre() ===
			Enumere_Sanction_1.EGenreSanction.ExclusionDefinitive
		) {
			if (aAbsence.avecSursis) {
				H.push(
					" (",
					ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.avecSursis"),
				);
				if (aAbsence.dateFinSursis) {
					H.push(
						ObjetDate_1.GDate.formatDate(
							aAbsence.dateFinSursis,
							" " +
								ObjetTraduction_1.GTraductions.getValeur("jusquAu") +
								" %J %MMM",
						),
					);
				}
				H.push(")");
			}
		}
		return H.join("");
	}
	getInfosModalitesPunitionSanction(aAbsence) {
		const lResult = {
			titre: "",
			programmations: [],
			demandeur: "",
			demandeLe: "",
		};
		switch (aAbsence.Genre) {
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
			case Enumere_Ressource_1.EGenreRessource.Punition:
				if (aAbsence.nature && aAbsence.nature.getLibelle()) {
					lResult.titre = aAbsence.nature.getLibelle();
				} else {
					lResult.titre =
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punition");
				}
				if (aAbsence.programmation && aAbsence.programmation.count() > 0) {
					const lPrefixe =
						aAbsence.nature.getGenre() ===
						TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.aRendreLe",
								) + " "
							: "";
					for (let I = 0; I < aAbsence.programmation.count(); I++) {
						const lProg = aAbsence.programmation.get(I);
						let lTemp = ObjetDate_1.GDate.formatDate(
							lProg.date,
							"%JJJ %J %MMM",
						);
						const lDate = MethodesObjet_1.MethodesObjet.isNumeric(lProg.place)
							? aAbsence.Genre ===
									Enumere_Ressource_1.EGenreRessource.Punition &&
								aAbsence.nature &&
								aAbsence.nature.getGenre() !==
									TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
								? ObjetDate_1.GDate.placeParJourEnDate(lProg.place)
								: ObjetDate_1.GDate.placeAnnuelleEnDate(lProg.place)
							: "";
						if (lDate && ObjetDate_1.GDate.estDateValide(lDate)) {
							lTemp +=
								" " +
								ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
									ObjetDate_1.GDate.formatDate(lDate, "%xh%sh%mm"),
								]) +
								" ";
						}
						if (lProg.duree) {
							if (
								lProg.placeExecution !== undefined &&
								lProg.placeExecution !== null
							) {
								const lExecution = ObjetDate_1.GDate.placeParJourEnDate(
									lProg.placeExecution,
								);
								if (lExecution && ObjetDate_1.GDate.estDateValide(lExecution)) {
									lTemp +=
										" " +
										ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
											ObjetDate_1.GDate.formatDate(lExecution, "%xh%sh%mm"),
										]) +
										" ";
								}
							}
							lTemp +=
								" - " +
								ObjetDate_1.GDate.formatDureeEnMillisecondes(
									UtilitaireDuree_1.TUtilitaireDuree.minEnMs(lProg.duree),
								);
						}
						lResult.programmations.push(lPrefixe + lTemp);
					}
				} else if (aAbsence.estProgrammable) {
					lResult.programmations.push(
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.nonProgramme"),
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				if (aAbsence.nature) {
					lResult.titre = aAbsence.nature.getLibelle();
				} else {
					lResult.titre = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.mesureConservatoire",
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				if (aAbsence.nature) {
					lResult.titre = aAbsence.nature.getLibelle();
				} else {
					lResult.titre =
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanction");
				}
				if (
					aAbsence.nature.getGenre() ===
					Enumere_Sanction_1.EGenreSanction.Autre_Exclusion
				) {
					lResult.titre +=
						" (" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.exclusion2",
						).toLowerCase() +
						") ";
				}
				lResult.titre += this.getDureeSanction(aAbsence);
				break;
			case Enumere_Ressource_1.EGenreRessource.Incident:
				if (aAbsence.mesure) {
					lResult.titre = this.getModalitesPunitionSanction(aAbsence.mesure);
				} else {
					lResult.titre =
						!!aAbsence.etatMesure && aAbsence.etatMesure !== ""
							? aAbsence.etatMesure
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.enAttenteDeDecision",
								);
				}
				break;
			default:
				break;
		}
		lResult.demandeur = this.getDemandeurDecideur(aAbsence);
		return lResult;
	}
	getModalitesPunitionSanction(aAbsence) {
		let lResult = "";
		switch (aAbsence.Genre) {
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
			case Enumere_Ressource_1.EGenreRessource.Punition:
				if (aAbsence.nature && aAbsence.nature.getLibelle()) {
					lResult += aAbsence.nature.getLibelle();
				} else {
					lResult +=
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punition");
				}
				if (aAbsence.programmation && aAbsence.programmation.count() > 0) {
					lResult +=
						" " +
						(aAbsence.nature.getGenre() ===
						TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
							? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.aRendreLe")
							: ObjetTraduction_1.GTraductions.getValeur("Le"));
					const lArray = [];
					for (let I = 0; I < aAbsence.programmation.count(); I++) {
						const lProg = aAbsence.programmation.get(I);
						let lTemp = ObjetDate_1.GDate.formatDate(lProg.date, " %J %MMM");
						const lDate = MethodesObjet_1.MethodesObjet.isNumeric(lProg.place)
							? aAbsence.Genre ===
									Enumere_Ressource_1.EGenreRessource.Punition &&
								aAbsence.nature &&
								aAbsence.nature.getGenre() !==
									TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
								? ObjetDate_1.GDate.placeParJourEnDate(lProg.place)
								: ObjetDate_1.GDate.placeAnnuelleEnDate(lProg.place)
							: "";
						if (lDate && ObjetDate_1.GDate.estDateValide(lDate)) {
							lTemp +=
								" " +
								ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
									ObjetDate_1.GDate.formatDate(lDate, "%xh%sh%mm"),
								]) +
								" ";
						}
						if (lProg.duree) {
							if (
								lProg.placeExecution !== undefined &&
								lProg.placeExecution !== null
							) {
								const lExecution = ObjetDate_1.GDate.placeParJourEnDate(
									lProg.placeExecution,
								);
								if (lExecution && ObjetDate_1.GDate.estDateValide(lExecution)) {
									lTemp +=
										" " +
										ObjetTraduction_1.GTraductions.getValeur("Dates.AHeure", [
											ObjetDate_1.GDate.formatDate(lExecution, "%xh%sh%mm"),
										]) +
										" ";
								}
							}
							lTemp +=
								" - " +
								ObjetDate_1.GDate.formatDureeEnMillisecondes(
									UtilitaireDuree_1.TUtilitaireDuree.minEnMs(lProg.duree),
								);
						}
						lArray.push(lTemp);
					}
					lResult += lArray.join(",");
				} else if (aAbsence.estProgrammable) {
					lResult +=
						" - " +
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.nonProgramme");
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				if (aAbsence.nature) {
					lResult += aAbsence.nature.getLibelle();
				} else {
					lResult += ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.mesureConservatoire",
					);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				if (aAbsence.nature) {
					lResult += aAbsence.nature.getLibelle();
				} else {
					lResult +=
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanction");
				}
				if (
					aAbsence.nature.getGenre() ===
					Enumere_Sanction_1.EGenreSanction.Autre_Exclusion
				) {
					lResult +=
						" (" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.exclusion2",
						).toLowerCase() +
						") ";
				}
				lResult += this.getDureeSanction(aAbsence);
				break;
			case Enumere_Ressource_1.EGenreRessource.Incident:
				if (aAbsence.mesure) {
					lResult += this.getModalitesPunitionSanction(aAbsence.mesure);
				} else {
					lResult +=
						!!aAbsence.etatMesure && aAbsence.etatMesure !== ""
							? aAbsence.etatMesure
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.enAttenteDeDecision",
								);
				}
				break;
			default:
				break;
		}
		return lResult.ucfirst();
	}
	getChaineTraductionGenreAbsence(aObjet) {
		switch (aObjet.genre) {
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				switch (aObjet.genreObservation) {
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet:
						if (!!aObjet.libelle) {
							return aObjet.libelle;
						}
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.defautDeCarnet",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.defautsDeCarnet",
								);
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres:
						if (!!aObjet.libelle) {
							return aObjet.libelle;
						}
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.autreObservation",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.autresObservations",
								);
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_ObservationParent:
						if (aObjet.estLue === false) {
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.observationNonLue",
							);
						}
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.observation",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.observations",
								);
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_Encouragement:
						if (aObjet.estLue === false) {
							return ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.encouragementNonLu",
							);
						}
						return aObjet.singulier
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.encouragement",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.encouragements",
								);
					default:
						return "";
				}
			case Enumere_Ressource_1.EGenreRessource.Absence:
				if (aObjet.aRegulariser && !aObjet.reglee) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.absenceAJustifier",
					);
				}
				if (aObjet.estUneCreationParent) {
					return aObjet.enAttente
						? aObjet.confirmee
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.absenceEnAttenteAcceptation",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.absencePrevueEnAttenteAcceptation",
								)
						: aObjet.justifie
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.absenceCoursJust",
								)
							: aObjet.reglee
								? ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.absenceCoursNonJust",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.absenceAJustifier",
									);
				}
				if (aObjet.enAttente) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.absenceEnAttenteAcceptation",
					);
				}
				if (aObjet.justifie === true) {
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absenceCoursJust",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absencesCoursJust",
							);
				}
				if (aObjet.justifie === false) {
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absenceCoursNonJust",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.absencesCoursNonJust",
							);
				}
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absence")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absences");
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absenceRepas")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absencesRepas");
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceInternat",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absencesInternat",
						);
			case Enumere_Ressource_1.EGenreRessource.Retard:
				if (aObjet.aRegulariser) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.retardAJustifier",
					);
				}
				if (aObjet.enAttente) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.retardEnAttenteAcceptation",
					);
				}
				if (aObjet.justifie === true) {
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardJust")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardsJust");
				}
				if (aObjet.justifie === false) {
					return aObjet.singulier
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.retardNonJust",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.retardsNonJust",
							);
				}
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retard")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retards");
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.infirmerie")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.infirmeries");
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.exclusion")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.exclusions");
			case Enumere_Ressource_1.EGenreRessource.Punition:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punition")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.punitions");
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanction")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.sanctions");
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesureConservatoire",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesuresConservatoires",
						);
			case Enumere_Ressource_1.EGenreRessource.Incident:
				return aObjet.singulier
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.incident")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.incidents");
			case Enumere_Ressource_1.EGenreRessource.Commission:
				return aObjet.libelle;
			case Enumere_Ressource_1.EGenreRessource.Dispense:
				if (aObjet.estUneCreationParent) {
					return aObjet.enAttente
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispenseEnAttenteAcceptation",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispenseValidee",
							);
				} else {
					return aObjet.libelle;
				}
			default:
				return "";
		}
	}
	arrayToChaine(aArray, aSeparateur, aSeparateurFin) {
		let lResult = "";
		if (aArray.length > 0) {
			lResult = aArray[aArray.length - 1];
			if (aArray.length > 1) {
				aArray.pop();
				lResult = aArray.join(aSeparateur) + aSeparateurFin + lResult;
			}
		}
		return lResult;
	}
	getChaineRecapitulatifPunitionSanction(aObjet) {
		let lResult = "";
		if (
			aObjet.genre === Enumere_Ressource_1.EGenreRessource.MesureConservatoire
		) {
			lResult +=
				aObjet.nombre +
				" " +
				(aObjet.nombre === 1
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesureConservatoire",
						).toLowerCase()
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesuresConservatoires",
						).toLowerCase());
			return lResult;
		} else if (aObjet.genre === Enumere_Ressource_1.EGenreRessource.Sanction) {
			lResult +=
				aObjet.nombre +
				" " +
				(aObjet.nombre === 1
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.sanction",
						).toLowerCase()
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.sanctions",
						).toLowerCase());
		} else {
			lResult +=
				aObjet.nombre +
				" " +
				(aObjet.nombre === 1
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.punition",
						).toLowerCase()
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.punitions",
						).toLowerCase());
		}
		if (aObjet.nombre > 1 && !!aObjet.recap && aObjet.recap.getNombre() > 0) {
			lResult +=
				" (" + ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.dont") + " ";
			const lPunitions = [];
			for (const j in aObjet.recap.Nombre) {
				const lLibelle = aObjet.recap.libelles[j];
				const lNombre = aObjet.recap.Nombre[j];
				if (lNombre > 0) {
					lPunitions.push(lNombre + " " + lLibelle);
				}
			}
			lResult += this.arrayToChaine(
				lPunitions,
				", ",
				" " + ObjetTraduction_1.GTraductions.getValeur("Et") + " ",
			);
			lResult += ")";
		}
		return lResult;
	}
	getTravailAFaire(aElement) {
		let lTAF = "";
		if (!!aElement.travailAFaire) {
			lTAF = aElement.travailAFaire;
		}
		const lTAFDoc = [];
		if (!!aElement.documentsTAF) {
			for (let k = 0; k < aElement.documentsTAF.count(); k++) {
				const lDocTAF = aElement.documentsTAF.get(k);
				lTAFDoc.push(
					'<span class="vsDoc">' +
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: lDocTAF,
							genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						}) +
						"</span>",
				);
			}
		}
		return (
			lTAF +
			(!!lTAF && !!lTAFDoc.length ? '<div class="vsDoc">' : "") +
			lTAFDoc.join(", ") +
			(!!lTAF && !!lTAFDoc.length ? "</div>" : "")
		);
	}
	estEspaceParent() {
		return [
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	getIndiceCoursParPlace(aListeCours, aPlaceCourante, aAvecCoursAnnule) {
		let lEcartAvant = -1000;
		let lIndiceAvant;
		if (MethodesObjet_1.MethodesObjet.isNumber(aPlaceCourante)) {
			for (let I = 0; I < aListeCours.count(); I++) {
				const lCours = aListeCours.get(I);
				if (
					lCours &&
					ObjetDate_1.GDate.estJourEgal(lCours.DateDuCours, new Date())
				) {
					if (!aAvecCoursAnnule && lCours.estAnnule) {
						continue;
					}
					if (
						aPlaceCourante >= lCours.Debut &&
						lCours.Fin - aPlaceCourante > lEcartAvant
					) {
						lEcartAvant = lCours.Fin - aPlaceCourante;
						lIndiceAvant = I;
					}
				}
			}
		}
		return lIndiceAvant;
	}
	static ajouterAbsence(aParam) {
		const lParent = aParam.instanceAppel;
		const lAbsenceAjoutee = new ObjetElement_1.ObjetElement(
			null,
			null,
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		lAbsenceAjoutee.estUneCreationParent = true;
		const lDateBornee = ObjetDate_1.GDate.getDateBornee(
			ObjetDate_1.GDate.aujourdhui,
		);
		const lHeureDebut = ObjetDate_1.GDate.placeParJourEnDate(0);
		const lHeureFin = ObjetDate_1.GDate.placeParJourEnDate(
			GParametres.PlacesParJour,
		);
		lAbsenceAjoutee.debut = {
			date: new Date(
				lDateBornee.getFullYear(),
				lDateBornee.getMonth(),
				lDateBornee.getDate(),
				lHeureDebut.getHours(),
				lHeureDebut.getMinutes(),
			),
			estMatin: true,
		};
		lAbsenceAjoutee.fin = {
			date: new Date(
				lDateBornee.getFullYear(),
				lDateBornee.getMonth(),
				lDateBornee.getDate(),
				lHeureFin.getHours(),
				lHeureFin.getMinutes(),
			),
			estMatin: false,
		};
		lAbsenceAjoutee.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFiche_SaisieAbsence_1.ObjetFiche_SaisieAbsence,
			{
				pere: this,
				evenement: function (aNumeroBouton, aDonnees) {
					if (aNumeroBouton === 1) {
						const lInstance = !!lParent.instance ? lParent.instance : lParent;
						const lRequete =
							new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(
								lInstance,
							);
						const lListeAbsences =
							new ObjetListeElements_1.ObjetListeElements().addElement(
								aDonnees,
							);
						lRequete
							.addUpload({
								listeFichiers: aDonnees.documents,
								conserverIdFichier: true,
							})
							.lancerRequete({ listeAbsences: lListeAbsences })
							.then((aParams) => {
								if (
									aParams.genreReponse &&
									aParams.genreReponse ===
										ObjetRequeteJSON_1.EGenreReponseSaisie.succes
								) {
									if (aParams.JSONReponse && aParams.JSONReponse.message) {
										GApplication.getMessage().afficher({
											titre: ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.message.previsionAbsenceImpossible",
											),
											message: aParams.JSONReponse.message.ucfirst(),
										});
									} else {
										lFenetre.fermer();
										Toast_1.Toast.afficher({
											msg: ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.message.confirmerDeclaration",
											),
											type: Toast_1.ETypeToast.succes,
										});
										if (aParam.callbackApresSaisieAbsences) {
											Object.assign(aParams, {
												absenceAjoutee: lAbsenceAjoutee,
											});
											aParam.callbackApresSaisieAbsences(aParams);
										}
									}
								}
							});
					}
				},
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({ listeBoutons: [] });
				},
			},
		);
		lFenetre.setDonnees(lAbsenceAjoutee);
	}
	static ajouterDispense(aParam) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieDispense_1.ObjetFenetre_SaisieDispense,
			{
				pere: aParam.instanceAppel,
				evenement: (aDispenses, aListePJs) => {
					const lRequete =
						new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(
							aParam.instanceAppel,
						);
					if (aListePJs && aListePJs.count() > 0) {
						lRequete.addUpload({ listeFichiers: aListePJs });
					}
					lRequete
						.lancerRequete({
							listeAbsences: aDispenses,
							estListeDispenses: true,
						})
						.then((aParamsReponse) => {
							if (
								aParamsReponse.genreReponse &&
								aParamsReponse.genreReponse ===
									ObjetRequeteJSON_1.EGenreReponseSaisie.succes
							) {
								lFenetre.fermer();
								Toast_1.Toast.afficher({
									msg:
										aDispenses.get(0).getEtat() ===
										Enumere_Etat_1.EGenreEtat.Suppression
											? ObjetTraduction_1.GTraductions.getValeur(
													"AbsenceVS.message.demandeSupprimee",
												)
											: ObjetTraduction_1.GTraductions.getValeur(
													"AbsenceVS.message.demandeTransmise",
												),
									type: Toast_1.ETypeToast.succes,
								});
								if (aParam.callbackApresSaisieDispense) {
									aParam.callbackApresSaisieDispense();
								}
							}
						});
				},
			},
		);
		if (aParam.element) {
			const lElmPourSaisie = MethodesObjet_1.MethodesObjet.dupliquer(
				aParam.element,
			);
			const lDispense = ObjetElement_1.ObjetElement.create({
				Numero: lElmPourSaisie.getNumero(),
				Genre: Enumere_Ressource_1.EGenreRessource.Dispense,
				cours: lElmPourSaisie.cours,
				justificatifs: lElmPourSaisie.documents,
				commentaire: lElmPourSaisie.justification,
				matieres: new ObjetListeElements_1.ObjetListeElements().add(
					lElmPourSaisie.matiere,
				),
				dateDebut: lElmPourSaisie.dateDebut,
				dateFin: lElmPourSaisie.dateFin,
			});
			lFenetre.setDonnees({
				estDispenseLongue: !lElmPourSaisie.cours,
				dispense: lDispense,
			});
		} else {
			lFenetre.setDonnees({ estDispenseLongue: aParam.estDispenseLongue });
		}
	}
	static getClassesIconePublicationPunition(aDatePublicationPunition) {
		const lClasses = [];
		lClasses.push("icon_info_sondage_publier");
		let lNomMixIcon;
		let lCouleurMixIcon;
		if (aDatePublicationPunition) {
			if (
				ObjetDate_1.GDate.estAvantJour(
					aDatePublicationPunition,
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
			lClasses.push("mix-" + lNomMixIcon);
			if (lCouleurMixIcon) {
				lClasses.push(lCouleurMixIcon);
			}
		}
		return lClasses.join(" ");
	}
	static getHintPublicationPunition(aDatePublicationPunition) {
		let lStrHint = "";
		if (aDatePublicationPunition) {
			const lStrDatePublication = ObjetDate_1.GDate.formatDate(
				aDatePublicationPunition,
				"%JJ/%MM/%AAAA",
			);
			if (
				ObjetDate_1.GDate.estAvantJour(
					aDatePublicationPunition,
					ObjetDate_1.GDate.getJour(ObjetDate_1.GDate.demain),
				)
			) {
				lStrHint = ObjetTraduction_1.GTraductions.getValeur(
					"punition.publieeDepuisLe",
					[lStrDatePublication],
				);
			} else {
				lStrHint = ObjetTraduction_1.GTraductions.getValeur(
					"punition.seraPublieeLe",
					[lStrDatePublication],
				);
			}
		} else {
			lStrHint = ObjetTraduction_1.GTraductions.getValeur(
				"punition.nonPubliee",
			);
		}
		return lStrHint;
	}
	static getDatePublicationPunitionParDefaut(aTypePunition) {
		let lNbJoursDecalagePublication = 0;
		if (aTypePunition && aTypePunition.nbJoursDecalagePublicationParDefaut) {
			lNbJoursDecalagePublication =
				aTypePunition.nbJoursDecalagePublicationParDefaut;
		}
		return ObjetDate_1.GDate.getJourSuivant(
			ObjetDate_1.GDate.getDateCourante(),
			lNbJoursDecalagePublication,
		);
	}
	_remplirInfosObservations(aElement, aGenreObservation, aNode, aModel) {
		aElement.html = {
			titre: aElement.infosDate.strDate(),
			content: [],
			aria: aElement.infosDate.strDate(),
			node: "",
			model: "",
			class: ["listeDetails Observation"],
			classSection: [],
			auteur: "",
			matiere:
				!!aElement.matiere && aElement.matiere.getLibelle()
					? aElement.matiere.getLibelle()
					: "",
			commentaire: !!aElement.commentaire
				? ObjetChaine_1.GChaine.replaceRCToHTML(aElement.commentaire)
				: "",
		};
		if (
			aGenreObservation ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres
		) {
			aElement.html.class.push("OVS_Autres");
			aElement.html.aria += " " + aElement.getLibelle();
		}
		if (aElement.demandeur) {
			aElement.html.auteur =
				aElement.demandeur.getLibelle() +
				(aElement.demandeur.estProfPrincipal
					? " (" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.ProfPrincipal",
						) +
						")"
					: "");
			aElement.html.content.push("<div>" + aElement.html.auteur + "</div>");
			aElement.html.aria += " - " + aElement.html.auteur;
		}
		if (!!aElement.html.matiere) {
			aElement.html.content.push("<div>" + aElement.html.matiere + "</div>");
			aElement.html.aria += ", " + aElement.html.matiere;
		}
		if (!!aElement.commentaire) {
			aElement.html.content.push(
				'<div class="commentaire">' + aElement.html.commentaire + "</div>",
			);
			aElement.html.aria += " " + aElement.commentaire;
		}
		if (aNode || aModel) {
			aElement.html.node = aNode;
			aElement.html.model = aModel;
			aElement.html.content.push(
				'<div class="avecJustification">',
				this.getCheckBoxVS({ ieModel: aElement.html.model }),
				"</div>",
			);
		}
		if (aElement.estLue) {
			aElement.html.class.push("estLue");
		}
		if (aElement.estPremier) {
			aElement.html.class.push("VSRegroupement1rFils");
		}
	}
	_remplirInfosInfirmerie(aElement) {
		aElement.html = {
			titre: aElement.infosDate.strDate(),
			content: [],
			aria: aElement.infosDate.strDate(),
			node: "",
			model: "",
			class: ["listeDetails Infirmerie"],
			classSection: [],
		};
		aElement.html.content.push(this.getSymptomesMedicauxVS(aElement).tohtml());
		aElement.html.content.push(this.getActesMedicauxVS(aElement).tohtml());
		aElement.html.content.push(
			this.getCommentaireInfirmerieVS(aElement).tohtml(),
		);
	}
	_remplirInfosPunition(aElement, aModel) {
		const lInfos = this.getInfosModalitesPunitionSanction(aElement);
		aElement.html = {
			titre: lInfos.titre,
			content: [],
			aria: lInfos.titre,
			node: "",
			model: "",
			class: ["listeDetails Punition"],
			classSection: [],
		};
		if (aElement.estLue) {
			aElement.html.class.push("estLue");
		}
		lInfos.programmations.forEach((aVal) => {
			aElement.html.content.push(
				'<div class="contentProgrammation"><span class="colorVS">' +
					aVal +
					"</span></div>",
			);
		});
		if (lInfos.demandeur) {
			aElement.html.content.push(
				'<div class="contentDemandeur">' + lInfos.demandeur + "</div>",
			);
		}
		if (aElement.infosDate && aElement.infosDate.date) {
			aElement.html.content.push(
				'<div class="contentDate">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.demande_le",
					).ucfirst() +
					' : <span class="colorTexte">' +
					aElement.infosDate.date +
					"</span></div>",
			);
		}
		if (aElement.listeMotifs) {
			aElement.html.content.push(
				'<div class="contentMotif">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.motif",
					).ucfirst() +
					' : <span class="colorVS">' +
					aElement.listeMotifs.getTableauLibelles().join(", ") +
					"</span></div>",
			);
		}
		const lCirconstances = this.getCirconstances(aElement);
		if (!!lCirconstances) {
			aElement.html.content.push(
				'<div class="contentCirconstances">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.circonstances",
					).ucfirst() +
					' : <span class="colorTexte">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(lCirconstances) +
					"</span></div>",
			);
		}
		const lTAF = this.getTravailAFaire(aElement);
		if (!!lTAF) {
			aElement.html.content.push(
				'<div class="contentTAF">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.travailAFaire",
					).ucfirst() +
					' : <span class="colorTexte">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(lTAF) +
					"</span></div>",
			);
		}
		if (aModel) {
			aElement.html.model = aModel;
			aElement.html.content.push(
				'<div class="avecJustification">',
				this.getCheckBoxVS({ ieModel: aElement.html.model }),
				"</div>",
			);
		}
	}
	_remplirInfosSanction(aElement) {
		const lInfos = this.getInfosModalitesPunitionSanction(aElement);
		aElement.html = {
			titre: lInfos.titre,
			content: [],
			aria: lInfos.titre,
			node: "",
			model: "",
			class: ["listeDetails Sanction"],
			classSection: [],
		};
		if (aElement.infosDate && aElement.infosDate.date) {
			aElement.html.content.push(
				'<div class="contentDate"><span class="colorVS">' +
					aElement.infosDate.strDate() +
					"</span></div>",
			);
		}
		if (lInfos.demandeur) {
			aElement.html.content.push(
				'<div class="contentDemandeur">' + lInfos.demandeur + "</div>",
			);
		}
		if (aElement.listeMotifs) {
			aElement.html.content.push(
				'<div class="contentMotif">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.motif",
					).ucfirst() +
					' : <span class="colorVS">' +
					aElement.listeMotifs.getTableauLibelles().join(", ") +
					"</span></div>",
			);
		}
		const lCirconstances = this.getCirconstances(aElement);
		if (!!lCirconstances) {
			aElement.html.content.push(
				'<div class="contentCirconstances">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.circonstances",
					).ucfirst() +
					' : <span class="colorTexte">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(lCirconstances) +
					"</span></div>",
			);
		}
	}
	_remplirInfosMesuresConservatoire(aElement) {
		const lInfos = this.getInfosModalitesPunitionSanction(aElement);
		aElement.html = {
			titre: aElement.infosDate.strDate(),
			content: [],
			aria: aElement.infosDate.strDate(),
			node: "",
			model: "",
			class: ["listeDetails MesuresConservatoire"],
			classSection: [],
		};
		if (lInfos.demandeur) {
			aElement.html.content.push(
				'<div class="contentDemandeur">' + lInfos.demandeur + "</div>",
			);
		}
		if (aElement.listeMotifs) {
			aElement.html.content.push(
				'<div class="contentMotif">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.motif",
					).ucfirst() +
					' : <span class="colorVS">' +
					aElement.listeMotifs.getTableauLibelles().join(", ") +
					"</span></div>",
			);
		}
		const lCirconstances = this.getCirconstances(aElement);
		if (!!lCirconstances) {
			aElement.html.content.push(
				'<div class="contentCirconstances">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.circonstances",
					).ucfirst() +
					' : <span class="colorTexte">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(lCirconstances) +
					"</span></div>",
			);
		}
		if (aElement.interditAcces) {
			aElement.html.content.push(
				'<div class="contentInterditAccess">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.interditLAcces",
					).ucfirst() +
					"</div>",
			);
			if (
				aElement.interditAcces.contains(
					TypePerimetreMesureConservatoire_1.TypePerimetreMesureConservatoire
						.PMC_Externat,
				)
			) {
				aElement.html.content.push(
					'<div class="itemVSListe"><span class="colorVS">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesureconservatoire.aLEtablissement",
						) +
						"</span></div>",
				);
			}
			if (
				aElement.interditAcces.contains(
					TypePerimetreMesureConservatoire_1.TypePerimetreMesureConservatoire
						.PMC_DP,
				)
			) {
				aElement.html.content.push(
					'<div class="itemVSListe"><span class="colorVS">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesureconservatoire.aLaDemiPension",
						) +
						"</span></div>",
				);
			}
			if (
				aElement.interditAcces.contains(
					TypePerimetreMesureConservatoire_1.TypePerimetreMesureConservatoire
						.PMC_Internat,
				)
			) {
				aElement.html.content.push(
					'<div class="itemVSListe"><span class="colorVS">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.mesureconservatoire.aLInternat",
						) +
						"</span></div>",
				);
			}
		}
	}
	_remplirInfosIncident(aElement, aModel) {
		const lInfos = this.getInfosModalitesPunitionSanction(aElement);
		aElement.html = {
			titre: aElement.infosDate.strDate(),
			content: [],
			aria: aElement.infosDate.strDate(),
			node: "",
			model: "",
			class: ["listeDetails MesuresConservatoire"],
			classSection: [],
		};
		if (lInfos.demandeur) {
			aElement.html.content.push(
				'<div class="contentDemandeur">' + lInfos.demandeur + "</div>",
			);
		}
		if (aElement.listeMotifs) {
			aElement.html.content.push(
				'<div class="contentMotif">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.motif",
					).ucfirst() +
					' : <span class="colorVS">' +
					aElement.listeMotifs.getTableauLibelles().join(", ") +
					"</span></div>",
			);
		}
		const lCirconstances = aElement.getLibelle();
		if (!!lCirconstances) {
			aElement.html.content.push(
				'<div class="contentCirconstances">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.details",
					).ucfirst() +
					' : <span class="colorTexte">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(lCirconstances) +
					"</span></div>",
			);
		}
		aElement.html.content.push(
			'<div class="contentMesuresDisciplinaire">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.titres.mesureDisciplinaire",
				).ucfirst() +
				' : <span class="colorVS">' +
				lInfos.titre +
				"</span></div>",
		);
		if (!!aElement.gravite) {
			aElement.html.content.push(
				'<div class="contentGravite">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.titres.gravite",
					).ucfirst() +
					' : <span class="colorVS">' +
					aElement.gravite +
					"</span></div>",
			);
		}
		if (aModel) {
			aElement.html.model = aModel;
			aElement.html.content.push(
				'<div class="avecJustification">',
				this.getCheckBoxVS({ ieModel: aElement.html.model }),
				"</div>",
			);
		}
	}
	getIconAbsence(aElement) {
		if (
			(aElement.avecSaisie || !aElement.reglee) &&
			((aElement.motifParent && aElement.motifParent.existeNumero()) ||
				aElement.enAttente) &&
			!aElement.confirmee
		) {
			return "icon_edt_permanence";
		}
		if (!aElement.aRegulariser && aElement.justifie) {
			return "icon_ok";
		}
		if (aElement.refusee) {
			return "icon_fermeture_widget";
		}
		if (!aElement.aRegulariser && aElement.reglee) {
			return (
				"icon_ok" +
				([
					Enumere_Ressource_1.EGenreRessource.Absence,
					Enumere_Ressource_1.EGenreRessource.Retard,
					Enumere_Ressource_1.EGenreRessource.Dispense,
				].includes(aElement.getGenre())
					? " traitee"
					: "")
			);
		} else if (
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence ||
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard
		) {
			return "icon_exclamation";
		}
		return "";
	}
	getCommentaireDAbsence(aElement, aPourParent) {
		let lCommentaire = "";
		if (aPourParent && !!aElement.justification) {
			lCommentaire = aElement.justification;
		}
		return lCommentaire;
	}
	_remplirInfosAbsences(aElement, aParams) {
		aElement.infosMotif = this.getInfosMotifAbsenceVS({
			donnee: aElement,
			pourSaisieParent: aParams.avecSaisie,
		});
		aElement.html = {
			titre: aElement.infosDate.strDate(),
			content: [],
			icon: "",
			aria: aElement.infosDate.strDate(),
			node: "",
			model: "",
			class: ["listeDetails Absence"],
			classSection: [],
			motif: "",
			motifMessage: "",
			nbrHeures: "",
			duree: "",
			justifie: "",
			avecDocuments:
				!!aElement.documents && aElement.documents.getNbrElementsExistes() > 0,
			commentaire: this.getCommentaireDAbsence(aElement, aParams.pourParent),
			avecSaisie: aParams.avecSaisie && aElement.avecSaisie,
		};
		aElement.html.icon =
			'<i aria-hidden="true" class="iconVSDetail ' +
			this.getIconAbsence(aElement) +
			'"></i>';
		if (aElement.reglee) {
			aElement.html.class.push("estLue");
		}
		if (!aParams.avecBascule) {
			aElement.html.classSection.push("sansBascule");
		}
		if (aParams.node) {
			aElement.html.node = aParams.node;
		}
		aElement.html.content.push('<div class="sectionVSMotif">');
		if (aElement.NbrHeures && !GEtatUtilisateur.pourPrimaire()) {
			aElement.html.nbrHeures = this.getHeuresCoursManquees(aElement, true);
			aElement.html.content.push("<div>" + aElement.html.nbrHeures + "</div>");
		}
		if (!!aElement.duree) {
			aElement.html.duree =
				aElement.duree +
				" " +
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.minutes");
			aElement.html.content.push("<div>" + aElement.html.duree + "</div>");
		}
		if (aElement.infosMotif.existe()) {
			aElement.html.motif =
				aElement.infosMotif.label +
				'<span class="colorVS">' +
				aElement.infosMotif.texte +
				"</span>";
			aElement.html.content.push("<div>" + aElement.html.motif + "</div>");
		}
		if (!!aElement.infosMotif.message) {
			aElement.html.content.push(
				'<div class="VSmessage">' + aElement.infosMotif.message + "</div>",
			);
		}
		if (aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence) {
			let lStrAffichee = "";
			let lClassCss = ["justifie"];
			if (aElement.aRegulariser) {
				lClassCss.push("aJustifier");
				lStrAffichee = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.absenceAJustifier",
				);
			} else if (!aElement.enAttente || aElement.reglee) {
				lStrAffichee = aElement.justifie
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceCoursJust",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceCoursNonJust",
						);
			} else if (!aElement.message && aElement.estUneCreationParent) {
				lStrAffichee = aElement.refusee
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.absenceRefusee")
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceConfirmee",
						);
			}
			aElement.html.justifie = lStrAffichee.ucfirst();
			aElement.html.content.push(
				'<div class="' +
					lClassCss.join(" ") +
					'">' +
					aElement.html.justifie +
					"</div>",
			);
		}
		if (aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard) {
			let lStrAffichee = "";
			let lClassCss = ["justifie"];
			if (aElement.aRegulariser) {
				lStrAffichee = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.retardAJustifier",
				);
				if (aElement.avecSaisie && aParams.avecSaisie) {
					lClassCss.push("aJustifier");
				}
			} else if (!aElement.enAttente || aElement.reglee) {
				lStrAffichee = aElement.justifie
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardJust")
					: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.retardNonJust");
			}
			aElement.html.justifie = lStrAffichee;
			aElement.html.content.push(
				'<div class="' +
					lClassCss.join(" ") +
					'">' +
					aElement.html.justifie +
					"</div>",
			);
		}
		aElement.html.content.push("</div>");
		if (aParams.avecDetailEdition) {
			if (!aParams.avecBascule) {
				aElement.html.content.push('<div class="sectionVSIcones">');
				let lIconDocs = "";
				if (aElement.html.avecDocuments && aParams.ieHintPJ) {
					lIconDocs =
						'<i class="icon_piece_jointe" ' + aParams.ieHintPJ + "></i>";
				}
				aElement.html.content.push(
					'<div class="iconVSAbsence">',
					lIconDocs,
					"</div>",
				);
				let lIconCommentaire;
				if (!!aElement.html.commentaire && aParams.ieHintCommentaire) {
					lIconCommentaire =
						'<i class="icon_nouvelle_conversation" ' +
						aParams.ieHintCommentaire +
						"></i>";
				}
				aElement.html.content.push(
					'<div class="iconVSAbsence">',
					lIconCommentaire,
					"</div>",
				);
				aElement.html.content.push("</div>");
				aElement.html.content.push('<div class="sectionVSEdition">');
				if (aElement.avecSaisie && aParams.avecSaisie) {
					let lBtnLabel = ObjetTraduction_1.GTraductions.getValeur("Justifier");
					let lThemeBouton = Type_ThemeBouton_1.TypeThemeBouton.primaire;
					if (
						lIconDocs ||
						lIconCommentaire ||
						(aElement.motifParent && aElement.motifParent.existeNumero())
					) {
						lBtnLabel = ObjetTraduction_1.GTraductions.getValeur("Modifier");
						lThemeBouton = Type_ThemeBouton_1.TypeThemeBouton.secondaire;
					}
					aElement.html.content.push(
						'<ie-bouton class="',
						lThemeBouton,
						'" ',
						aParams.nodeEdition,
						">",
						lBtnLabel,
						"</ie-bouton>",
					);
				} else {
					aElement.html.content.push(
						'<div class="btnVisu" ',
						aParams.nodeEdition,
						'><i class="icon_eye_open"></i></div>',
					);
				}
				aElement.html.content.push("</div>");
			} else {
				if (aElement.avecSaisie) {
					const lInfo =
						aElement.message && aElement.message.replace
							? ' ie-hint="' + aElement.message.replace(/\n/g, "<br />") + '"'
							: "";
					if (aParams.avecSaisie) {
						if (!aElement.motifParent || !aElement.motifParent.existeNumero()) {
							aElement.html.content.push(
								'<div class="avecJustification avecLienJustifie"',
								lInfo,
								">",
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.jeJustifie",
								),
								' <i class="icon_justifier"></i></div>',
							);
						}
					}
				}
			}
		}
	}
	avecCommandeContacterReferentsVS() {
		let lAvecCommandeContacterReferentsVS = false;
		const lEtatUtilisateurSco = GApplication.getEtatUtilisateur();
		if (
			UtilitaireContactReferents_1.UtilitaireContactReferents.avecAffichageContactReferentsVieScolaire(
				lEtatUtilisateurSco.GenreEspace,
			)
		) {
			const lEtablissement = lEtatUtilisateurSco.getEtablissement();
			if (lEtablissement) {
				lAvecCommandeContacterReferentsVS =
					UtilitaireContactReferents_1.UtilitaireContactReferents.auMoinsUnReferentVieScolaireAccepteDiscussion(
						lEtablissement.listeReferentsVieScolaire,
					);
			}
		}
		return lAvecCommandeContacterReferentsVS;
	}
	avecCommandeDeclarerUneAbsence() {
		return GApplication.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.avecDeclarerUneAbsence,
		);
	}
	avecCommandesDeclarerDispenses() {
		const lEtatUtilisateurSco = GApplication.getEtatUtilisateur();
		const lListeMatieresDispensables =
			lEtatUtilisateurSco.getMembre().listeMatieresDeclarationDispense;
		const lAvecAuMoinsUneMatiereDispensable = lListeMatieresDispensables
			? lListeMatieresDispensables.count() > 0
			: false;
		return lAvecAuMoinsUneMatiereDispensable;
	}
	avecCommandeDeclarerUneDispensePonctuelle() {
		return (
			this.avecCommandesDeclarerDispenses() &&
			GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecDeclarerDispensePonctuelle,
			)
		);
	}
	avecCommandeDeclarerUneDispenseLongue() {
		return (
			this.avecCommandesDeclarerDispenses() &&
			GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecDeclarerDispenseLongue,
			)
		);
	}
}
exports.ObjetUtilitaireAbsence = ObjetUtilitaireAbsence;
