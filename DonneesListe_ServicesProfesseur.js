exports.DonneesListe_ServicesProfesseur = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const _ObjetCouleur_1 = require("_ObjetCouleur");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ServicesProfesseur extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		if (!!aDonnees) {
			aDonnees.parcourir((D) => {
				let lCoeffEstEditable = false;
				if (
					!!D.estService &&
					!D.estRattache &&
					!_estServiceRattacheApparaissantCommeService(D) &&
					!D.avecPlusieursCoefficients
				) {
					lCoeffEstEditable = true;
				}
				D.coefficientEstEditable = lCoeffEstEditable;
				if (_estServiceRattacheApparaissantCommeSousService(D) && !!D.pere) {
					D.pere.coefficientEstEditable = false;
				}
			});
		}
		super(aDonnees);
		this.appSco = (0, AccessApp_1.getApp)();
		this.avecCreerSousServices = aParam.avecCreerSousServices;
		this.callbackCreerSousService = aParam.callbackCreerSousService;
		this.callbackSupprimerSousService = aParam.callbackSupprimerSousService;
		this.callbackCreerDevoirDNL = aParam.callbackCreerDevoirDNL;
		this.estAvecEdition = aParam.avecEdition || false;
		this.setOptions({
			avecEtatSaisie: false,
			avecDeploiement: true,
			avecEvnt_Selection: true,
			avecEvnt_Suppression: true,
		});
	}
	avecEdition(aParams) {
		if (this.estAvecEdition) {
			switch (aParams.idColonne) {
				case DonneesListe_ServicesProfesseur.colonnes.facultatif:
					return (
						!!aParams.article.estService &&
						!_estServiceRattacheApparaissantCommeSousService(aParams.article)
					);
				case DonneesListe_ServicesProfesseur.colonnes.coefficient:
					return (
						!!aParams.article.coefficient &&
						!!aParams.article.coefficientEstEditable &&
						!aParams.article.estSansNote &&
						!!this.appSco
							.getEtatUtilisateur()
							.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Periode,
							) &&
						this.appSco
							.getEtatUtilisateur()
							.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Periode,
							)
							.existeNumero()
					);
			}
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ServicesProfesseur.colonnes.facultatif:
				aParams.article.facultatif = V;
				break;
			case DonneesListe_ServicesProfesseur.colonnes.coefficient:
				aParams.article.coefficient = V;
				break;
		}
	}
	avecEvenementApresEdition(aParams) {
		return this.avecEdition(aParams);
	}
	getOptionsNote() {
		return {
			afficherAvecVirgule: true,
			sansNotePossible: false,
			avecAnnotation: false,
		};
	}
	avecSuppression(aParams) {
		return _estSupprimable(aParams.article);
	}
	avecInterruptionSuppression() {
		return true;
	}
	suppressionConfirmation() {
		return false;
	}
	avecEvenementSelectionDblClick(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_ServicesProfesseur.colonnes.programmesBO
		) {
			return (
				!!aParams.article.liensProgrammesBO &&
				aParams.article.liensProgrammesBO.count() > 0
			);
		}
		return false;
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.matiere
		);
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.matiere
		);
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_ServicesProfesseur.colonnes.matiere:
				if (!!aParams.article.pere) {
					lClasses.push("EspaceGauche10");
				}
				break;
			case DonneesListe_ServicesProfesseur.colonnes.professeur:
				if (
					!aParams.article.estService ||
					aParams.article.estEnCoEnseignement === true
				) {
					if (!aParams.article.estService) {
						if (_leSousServiceMAppartient(aParams.article)) {
							lClasses.push("Gras");
						}
					} else if (aParams.article.estEnCoEnseignement === true) {
						if (aParams.article.estResponsable === true) {
							lClasses.push("Gras");
						}
					}
				} else {
					lClasses.push("Gras");
				}
				break;
			case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs:
			case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations:
			case DonneesListe_ServicesProfesseur.colonnes.volume:
			case DonneesListe_ServicesProfesseur.colonnes.coefficient:
				lClasses.push("AlignementDroit");
				break;
			case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
				lClasses.push("AlignementMilieu");
				if (
					!!aParams.article.liensProgrammesBO &&
					aParams.article.liensProgrammesBO.count() > 0
				) {
					lClasses.push("AvecMain");
				}
				break;
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ServicesProfesseur.colonnes.matiere:
				return aParams.article.pere
					? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc
					: new _ObjetCouleur_1.ObjectCouleurCellule(
							GCouleur.themeCouleur.claire,
							GCouleur.noir,
							GCouleur.grisFonce,
						);
			case DonneesListe_ServicesProfesseur.colonnes.classe:
			case DonneesListe_ServicesProfesseur.colonnes.professeur:
				return new _ObjetCouleur_1.ObjectCouleurCellule(
					GCouleur.themeCouleur.claire,
					GCouleur.noir,
					GCouleur.grisFonce,
				);
			case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
				if (
					!!aParams.article.liensProgrammesBO &&
					aParams.article.liensProgrammesBO.count() > 0
				) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
				}
		}
	}
	getTri(aCol, aGenreTri) {
		function _triProf(D) {
			const lProfesseur = D.listeProfesseurs.getPremierElement();
			return !!lProfesseur ? lProfesseur.getPosition() : 0;
		}
		const lTableau = [],
			lGenreTri = aGenreTri;
		const lThis = this;
		switch (this.getId(aCol)) {
			case DonneesListe_ServicesProfesseur.colonnes.matiere:
				lTableau.push(ObjetTri_1.ObjetTri.init("Libelle", aGenreTri));
				break;
			case DonneesListe_ServicesProfesseur.colonnes.professeur:
				lTableau.push(ObjetTri_1.ObjetTri.init(_triProf, lGenreTri));
				break;
			case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.nbrDevoirsPeriode || -1;
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.nbrDevoirsTotal || -1;
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.nbrEvaluationsPeriode || -1;
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.nbrEvaluationsTotal || -1;
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_ServicesProfesseur.colonnes.volume:
			case DonneesListe_ServicesProfesseur.colonnes.facultatif:
			case DonneesListe_ServicesProfesseur.colonnes.DNL:
			case DonneesListe_ServicesProfesseur.colonnes.modeDEvaluation:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							const lParams = lThis.paramsListe.getParams(aCol, -1, {
								article: D,
							});
							return lThis.getValeur(lParams);
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_ServicesProfesseur.colonnes.coefficient:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							if (D.avecPlusieursCoefficients) {
								return 1;
							}
							if (!!D.coefficient) {
								if (D.coefficient.estUneValeur()) {
									return D.coefficient.getValeur();
								}
								return D.coefficient.getGenre();
							}
							return "";
						},
						lGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_ServicesProfesseur.colonnes.classe:
			case DonneesListe_ServicesProfesseur.colonnes.periodes:
				lTableau.push(
					ObjetTri_1.ObjetTri.init((D) => {
						const lParams = lThis.paramsListe.getParams(aCol, -1, {
							article: D,
						});
						return lThis.getValeur(lParams);
					}, lGenreTri),
				);
				break;
		}
		return [
			ObjetTri_1.ObjetTri.initRecursif(
				"pere",
				lTableau.concat([
					ObjetTri_1.ObjetTri.init("Libelle"),
					ObjetTri_1.ObjetTri.init((D) => {
						const lIdColonne = lThis.getNumeroColonneDId(
							DonneesListe_ServicesProfesseur.colonnes.classe,
						);
						const lParams = lThis.paramsListe.getParams(lIdColonne, -1, {
							article: D,
						});
						return lThis.getValeur(lParams);
					}),
					ObjetTri_1.ObjetTri.init(_triProf),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.getNumero();
					}),
				]),
			),
		];
	}
	avecContenuTronque(aParams) {
		return (
			aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.periodes
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ServicesProfesseur.colonnes.matiere: {
				const lTableauMatiere = [];
				lTableauMatiere.push(
					'<div class="InlineBlock AlignementMilieuVertical">',
					aParams.article.matiere.getLibelle(),
					"</div>",
				);
				if (aParams.article.estEnCoEnseignement) {
					lTableauMatiere.push(
						IE.jsx.str("i", {
							class: "icon_co_enseignement",
							style: "float:right; font-size: 1.4rem;",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"servicesProfesseur.HintServiceCoEnseignement",
							),
							role: "img",
						}),
					);
				}
				return lTableauMatiere.join("");
			}
			case DonneesListe_ServicesProfesseur.colonnes.classe: {
				let lClasse = aParams.article.classe.getLibelle();
				if (aParams.article.groupe && aParams.article.groupe.getLibelle()) {
					if (lClasse) {
						lClasse += " > ";
					}
					lClasse += aParams.article.groupe.getLibelle();
				}
				const lTableauClasses = [];
				lTableauClasses.push(lClasse);
				if (_estServiceRattacheApparaissantCommeService(aParams.article)) {
					lTableauClasses.push(
						'<div style="float:right;" class="Image_Trombone"></div>',
					);
				}
				return lTableauClasses.join("");
			}
			case DonneesListe_ServicesProfesseur.colonnes.professeur:
				return aParams.article.listeProfesseurs.getTableauLibelles().join(", ");
			case DonneesListe_ServicesProfesseur.colonnes.facultatif:
				return aParams.article.estService && aParams.article.facultatif;
			case DonneesListe_ServicesProfesseur.colonnes.modeDEvaluation:
				if (aParams.article.estSansNote === undefined) {
					return "";
				}
				return !aParams.article.estSansNote
					? ObjetTraduction_1.GTraductions.getValeur(
							"servicesProfesseur.Service_Avec_Notes",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"servicesProfesseur.Service_Sans_Notes",
						);
			case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs: {
				let lNbDevoirs = "";
				if (aParams.article.nbrDevoirsTotal) {
					lNbDevoirs =
						(aParams.article.nbrDevoirsPeriode
							? aParams.article.nbrDevoirsPeriode
							: 0) +
						"/" +
						aParams.article.nbrDevoirsTotal;
				}
				return lNbDevoirs;
			}
			case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations: {
				let lNbEvaluations = "";
				if (aParams.article.nbrEvaluationsTotal) {
					lNbEvaluations =
						(aParams.article.nbrEvaluationsPeriode
							? aParams.article.nbrEvaluationsPeriode
							: 0) +
						"/" +
						aParams.article.nbrEvaluationsTotal;
				}
				return lNbEvaluations;
			}
			case DonneesListe_ServicesProfesseur.colonnes.volume:
				return aParams.article.strVolumeHoraire;
			case DonneesListe_ServicesProfesseur.colonnes.coefficient: {
				let result = "";
				if (
					!_estServiceRattacheApparaissantCommeService(aParams.article) &&
					((!aParams.article.pere && !aParams.article.estSansNote) ||
						(!!aParams.article.pere && !aParams.article.pere.estSansNote))
				) {
					if (aParams.article.avecPlusieursCoefficients) {
						result = "x,xx";
					} else if (
						!!aParams.article.coefficient &&
						!aParams.article.coefficient.estUneNoteVide()
					) {
						result = aParams.article.coefficient;
					}
				}
				return result;
			}
			case DonneesListe_ServicesProfesseur.colonnes.periodes: {
				let lPeriode = "";
				const lPeriodesActives =
					aParams.article.periodesActives.getListeElements((aElement) => {
						if (aElement.active) {
							return aElement.active;
						}
					});
				const nbPeriodesActives = lPeriodesActives.count();
				if (nbPeriodesActives === 0) {
					lPeriode = ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.Aucune",
					);
				} else if (
					nbPeriodesActives === aParams.article.periodesActives.count()
				) {
					lPeriode = ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.Toutes",
					);
				} else {
					lPeriode = lPeriodesActives.getTableauLibelles().join(", ");
				}
				return lPeriode;
			}
			case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
				return !!aParams.article.liensProgrammesBO &&
					aParams.article.liensProgrammesBO.count() > 0
					? '<i class="icon_eye_open i-medium" role="img" aria-label="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"servicesProfesseur.VoirProgrammesBO",
							) +
							'"></i>'
					: "";
			case DonneesListe_ServicesProfesseur.colonnes.DNL:
				return !!aParams.article.estServiceDNL;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ServicesProfesseur.colonnes.facultatif:
			case DonneesListe_ServicesProfesseur.colonnes.DNL:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_ServicesProfesseur.colonnes.coefficient:
				if (!!aParams.article && aParams.article.avecPlusieursCoefficients) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
				}
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ServicesProfesseur.colonnes.matiere:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecMenuContextuel(aParams) {
		return !aParams.surFondListe;
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (!aParametres.article.pere && this.avecCreerSousServices) {
			aParametres.menuContextuel.addCommande(
				DonneesListe_ServicesProfesseur.genreAction.creer_sous_service,
				ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.CommandeCreerSousService",
				),
				true,
			);
		}
		if (
			!aParametres.article.pere &&
			aParametres.article.avecCreationDevoirDNL &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		) {
			aParametres.menuContextuel.addCommande(
				DonneesListe_ServicesProfesseur.genreAction.creer_devoir_DNL,
				ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.CommandeCreerDevoirDNL",
				),
				true,
			);
		}
		if (
			!!aParametres.article.pere &&
			aParametres.article.pere.estEnCoEnseignement !== true
		) {
			const lSupprimerSsServicePossible = _estSupprimable(aParametres.article);
			aParametres.menuContextuel.addCommande(
				DonneesListe_ServicesProfesseur.genreAction.supprimer_sous_service,
				ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.CommandeSupprimerSousService",
				),
				lSupprimerSsServicePossible,
			);
		}
	}
	evenementMenuContextuel(aParametres) {
		switch (aParametres.numeroMenu) {
			case DonneesListe_ServicesProfesseur.genreAction.creer_sous_service:
				this.callbackCreerSousService(aParametres.article);
				break;
			case DonneesListe_ServicesProfesseur.genreAction.supprimer_sous_service:
				this.callbackSupprimerSousService(aParametres.article);
				aParametres.avecActualisation = false;
				break;
			case DonneesListe_ServicesProfesseur.genreAction.creer_devoir_DNL: {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CreerDevoirDNL.TitreConf",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CreerDevoirDNL.MessageConf",
						aParametres.article.nomPeriodeDNL,
					),
					callback: function (aGenreAction) {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							lThis.callbackCreerDevoirDNL(aParametres.article);
						}
					},
				});
				break;
			}
			default:
		}
	}
}
exports.DonneesListe_ServicesProfesseur = DonneesListe_ServicesProfesseur;
(function (DonneesListe_ServicesProfesseur) {
	let colonnes;
	(function (colonnes) {
		colonnes["matiere"] = "servicesProfesseurMatiere";
		colonnes["classe"] = "servicesProfesseurClasse";
		colonnes["professeur"] = "servicesProfesseurProfesseur";
		colonnes["facultatif"] = "servicesProfesseurFacultatif";
		colonnes["modeDEvaluation"] = "servicesProfesseurModeDEvaluation";
		colonnes["nbDevoirs"] = "servicesProfesseurNbDevoirs";
		colonnes["nbEvaluations"] = "servicesProfesseurNbEvaluations";
		colonnes["volume"] = "servicesProfesseurVolume";
		colonnes["coefficient"] = "servicesProfesseurCoefficient";
		colonnes["periodes"] = "servicesProfesseurPeriodes";
		colonnes["programmesBO"] = "servicesProfesseurBO";
		colonnes["DNL"] = "servicesProfesseurDNL";
	})(
		(colonnes =
			DonneesListe_ServicesProfesseur.colonnes ||
			(DonneesListe_ServicesProfesseur.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction["creer_sous_service"] = "creerSousService";
		genreAction["supprimer_sous_service"] = "supprimerSousService";
		genreAction["creer_devoir_DNL"] = "creerDevoirDNL";
	})(
		(genreAction =
			DonneesListe_ServicesProfesseur.genreAction ||
			(DonneesListe_ServicesProfesseur.genreAction = {})),
	);
})(
	DonneesListe_ServicesProfesseur ||
		(exports.DonneesListe_ServicesProfesseur = DonneesListe_ServicesProfesseur =
			{}),
);
function _leSousServiceMAppartient(D) {
	let result = false;
	if (D.listeProfesseurs) {
		result = !!D.listeProfesseurs.getElementParNumero(
			GEtatUtilisateur.getUtilisateur().getNumero(),
		);
	}
	return result;
}
function _estSupprimable(D) {
	if (
		!D.estService &&
		!_estSousServiceDUnServiceRattacheApparaissantCommeSousService(D)
	) {
		return (
			!!D.pere &&
			D.pere.estEnCoEnseignement !== true &&
			_leSousServiceMAppartient(D)
		);
	}
	return false;
}
function _estServiceRattacheApparaissantCommeService(D) {
	return (
		D.estService === true &&
		D.estRattache === true &&
		D.estServicePartie === false
	);
}
function _estServiceRattacheApparaissantCommeSousService(D) {
	return (
		D.estService === true &&
		D.estRattache === true &&
		D.estServicePartie === true
	);
}
function _estSousServiceDUnServiceRattacheApparaissantCommeSousService(D) {
	return D.estService === false && D.estServicePartie === true;
}
