exports.ObjetRequetePageNotes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_RessourceArrondi_1 = require("Enumere_RessourceArrondi");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeArrondi_1 = require("TypeArrondi");
const TypeNote_1 = require("TypeNote");
class ObjetRequetePageNotes extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.periode = aParam.periode;
		this.JSON = {
			ressource: new ObjetElement_1.ObjetElement(
				"",
				aParam.numeroRessource,
				aParam.genreRessource,
			),
			periode: aParam.periode,
			service: new ObjetElement_1.ObjetElement("", aParam.numeroService),
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {};
		lParam.strInfoCloture = this.JSONReponse.strInfoCloture;
		lParam.autorisations = this.JSONReponse.autorisations;
		lParam.serviceEntier = this.JSONReponse.serviceEntier;
		lParam.baremeService = this.JSONReponse.baremeService;
		lParam.baremeParDefaut = this.JSONReponse.baremeParDefaut;
		this.servicePere = this.JSONReponse.service;
		this._traiterService(this.servicePere);
		lParam.Service = this._getService(
			!!lParam.serviceEntier ? lParam.serviceEntier.getNumero() : 0,
		);
		lParam.listeClasses = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeClasses) {
			lParam.listeClasses.add(this.JSONReponse.listeClasses);
			lParam.listeClasses.parcourir((aClasse) => {
				if (!aClasse.listePeriodes) {
					aClasse.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
				}
				aClasse.listePeriodes.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("Aucune"),
						0,
						0,
					),
				);
				aClasse.periodeParDefaut = aClasse.listePeriodes.getElementParNumero(
					aClasse.periodeParDefaut.getNumero(),
				);
			});
			lParam.listeClasses.trier();
		}
		lParam.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeEleves) {
			lParam.listeEleves.add(this.JSONReponse.listeEleves);
			lParam.listeEleves.parcourir((aEleve) => {
				if (!aEleve.classe) {
					aEleve.classe = new ObjetElement_1.ObjetElement("", 0);
				}
				if (!aEleve.classe.datesDebut) {
					aEleve.classe.datesDebut = [];
				}
				if (!aEleve.classe.datesFin) {
					aEleve.classe.datesFin = [];
				}
				if (!aEleve.groupe) {
					aEleve.groupe = new ObjetElement_1.ObjetElement("", 0);
				}
				if (!aEleve.groupe.datesDebut) {
					aEleve.groupe.datesDebut = [];
				}
				if (!aEleve.groupe.datesFin) {
					aEleve.groupe.datesFin = [];
				}
				if (!aEleve.listePeriodes) {
					aEleve.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
				}
				aEleve.listePeriodes.parcourir((aPeriodeEleve) => {
					if (
						!aPeriodeEleve.bonusMalus ||
						aPeriodeEleve.bonusMalus.getNote() === ""
					) {
						aPeriodeEleve.bonusMalus = new TypeNote_1.TypeNote("0,00");
					}
				});
				aEleve.listePeriodes.trier();
			});
			lParam.listeEleves.trier();
		}
		lParam.listeDevoirs = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeDevoirs) {
			lParam.listeDevoirs.add(this.JSONReponse.listeDevoirs);
			lParam.listeDevoirs.parcourir((aDevoir) => {
				aDevoir.service = this._getService(
					!!aDevoir.service ? aDevoir.service.getNumero() : 0,
				);
				aDevoir.estDevoirEditable = !!aDevoir.service
					? aDevoir.service.getActif()
					: false;
				aDevoir.listeSujets = new ObjetListeElements_1.ObjetListeElements();
				if (!!aDevoir.elmSujet) {
					aDevoir.listeSujets.addElement(aDevoir.elmSujet);
				} else if (!!aDevoir.libelleSujet) {
					aDevoir.listeSujets.addElement(
						new ObjetElement_1.ObjetElement(
							aDevoir.libelleSujet,
							aDevoir.getNumero(),
							Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						),
					);
				}
				aDevoir.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
				if (!!aDevoir.elmCorrige) {
					aDevoir.listeCorriges.addElement(aDevoir.elmCorrige);
				} else if (!!aDevoir.libelleCorrige) {
					aDevoir.listeCorriges.addElement(
						new ObjetElement_1.ObjetElement(
							aDevoir.libelleCorrige,
							aDevoir.getNumero(),
							Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						),
					);
				}
				if (!aDevoir.listeEleves) {
					aDevoir.listeEleves = new ObjetListeElements_1.ObjetListeElements();
				}
				if (!aDevoir.listeClasses) {
					aDevoir.listeClasses = new ObjetListeElements_1.ObjetListeElements();
				}
				aDevoir.listeClasses.parcourir((aClasseDevoir) => {
					if (!aClasseDevoir.listePeriodes) {
						aClasseDevoir.listePeriodes =
							new ObjetListeElements_1.ObjetListeElements();
					}
					const lClasse = lParam.listeClasses.getElementParNumero(
						aClasseDevoir.getNumero(),
					);
					for (let i = 0; i < aClasseDevoir.listePeriodes.count(); i++) {
						const lPeriodeDevoir = aClasseDevoir.listePeriodes.get(i);
						const lPeriode = lClasse.listePeriodes.getElementParNumero(
							lPeriodeDevoir.getNumero(),
						);
						lPeriodeDevoir.Actif = lPeriode ? lPeriode.getActif() : false;
					}
				});
				aDevoir.listeClasses.trier();
				if (!!aDevoir.evaluation && !!aDevoir.evaluation.listeCompetences) {
					aDevoir.evaluation.listeCompetences.parcourir(
						(aCompetenceDEvaluation) => {
							if (
								!!aCompetenceDEvaluation &&
								!!aCompetenceDEvaluation.informationQCM
							) {
								aCompetenceDEvaluation.informationQCM.listeQuestions =
									new ObjetListeElements_1.ObjetListeElements().fromJSON(
										aCompetenceDEvaluation.informationQCM.listeQuestions,
										_ajouterQuestionQCM,
									);
							}
						},
					);
				}
			});
			lParam.listeDevoirs.trier();
		}
		lParam.listeSujets = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeCorriges) {
			lParam.listeSujets.add(this.JSONReponse.listeSujets);
		}
		lParam.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeCorriges) {
			lParam.listeCorriges.add(this.JSONReponse.listeCorriges);
		}
		lParam.listeCategories = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeCategories) {
			lParam.listeCategories.add(this.JSONReponse.listeCategories);
		}
		lParam.avecColNR = this.JSONReponse.avecColNR;
		this.callbackReussite.appel(lParam);
	}
	_traiterService(aService, aServicePere) {
		if (!aService.listeEleves) {
			aService.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		}
		if (!aService.listePeriodes) {
			aService.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		}
		aService.listePeriodes.parcourir((aPeriode) => {
			aPeriode.arrondis = [];
			aPeriode.arrondis[
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant
			] = aPeriode.arrondiEleve;
			aPeriode.arrondis[
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion
			] = aPeriode.arrondiClasse;
		});
		if (this.periode.existeNumero()) {
			aService.periode = aService.listePeriodes.getElementParNumero(
				this.periode.getNumero(),
			);
		}
		if (!aService.periode) {
			aService.periode = new ObjetElement_1.ObjetElement();
			aService.periode.moyenneParSousMatiere = false;
			aService.periode.moyenneBulletinSurClasse = false;
			aService.periode.coefficient = new TypeNote_1.TypeNote(1.0);
			aService.periode.avecDevoirSupMoy = false;
			aService.periode.avecBonusMalus = false;
			aService.periode.ponderationNotePlusHaute = new TypeNote_1.TypeNote(1.0);
			aService.periode.ponderationNotePlusBasse = new TypeNote_1.TypeNote(1.0);
			aService.periode.arrondis = [];
			aService.periode.arrondis[
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant
			] = new TypeArrondi_1.TypeArrondi(0);
			aService.periode.arrondis[
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion
			] = new TypeArrondi_1.TypeArrondi(0);
		}
		if (!aService.listeServices) {
			aService.listeServices = new ObjetListeElements_1.ObjetListeElements();
		}
		aService.listeServices.parcourir((aSousService) => {
			this._traiterService(aSousService, aService);
		});
		aService.listeServices.trier();
		aService.avecSousService = aService.listeServices.count();
		aService.estUnServiceEnGroupe =
			!!aService.groupe && aService.groupe.existeNumero();
		if (!!aServicePere) {
			aService.pere = aServicePere;
		}
	}
	_getService(aNumeroService) {
		const lService =
			!!this.servicePere && !!this.servicePere.listeServices
				? this.servicePere.listeServices.getElementParNumero(aNumeroService)
				: null;
		return lService ? lService : this.servicePere;
	}
}
exports.ObjetRequetePageNotes = ObjetRequetePageNotes;
CollectionRequetes_1.Requetes.inscrire("PageNotes", ObjetRequetePageNotes);
function _ajouterQuestionQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	aElement.nouvellePosition = aElement.position;
	if (aJSON.listeReponses) {
		aElement.listeReponses =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				aJSON.listeReponses,
				_ajouterReponseQCM,
			);
	}
}
function _ajouterReponseQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}
