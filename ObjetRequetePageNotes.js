const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessourceArrondi } = require("Enumere_RessourceArrondi.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeArrondi } = require("TypeArrondi.js");
const { TypeNote } = require("TypeNote.js");
class ObjetRequetePageNotes extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.periode = aParam.periode;
		this.JSON = {
			ressource: new ObjetElement(
				"",
				aParam.numeroRessource,
				aParam.genreRessource,
			),
			periode: aParam.periode,
			service: new ObjetElement("", aParam.numeroService),
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
		_traiterService.call(this, this.servicePere);
		lParam.Service = _getService.call(
			this,
			!!lParam.serviceEntier ? lParam.serviceEntier.getNumero() : 0,
		);
		lParam.listeClasses = new ObjetListeElements();
		if (!!this.JSONReponse.listeClasses) {
			lParam.listeClasses.add(this.JSONReponse.listeClasses);
			lParam.listeClasses.parcourir((aClasse) => {
				if (!aClasse.listePeriodes) {
					aClasse.listePeriodes = new ObjetListeElements();
				}
				aClasse.listePeriodes.addElement(
					new ObjetElement(GTraductions.getValeur("Aucune"), 0, 0),
				);
				aClasse.periodeParDefaut = aClasse.listePeriodes.getElementParNumero(
					aClasse.periodeParDefaut.getNumero(),
				);
			});
			lParam.listeClasses.trier();
		}
		lParam.listeEleves = new ObjetListeElements();
		if (!!this.JSONReponse.listeEleves) {
			lParam.listeEleves.add(this.JSONReponse.listeEleves);
			lParam.listeEleves.parcourir((aEleve) => {
				if (!aEleve.classe) {
					aEleve.classe = new ObjetElement("", 0);
				}
				if (!aEleve.classe.datesDebut) {
					aEleve.classe.datesDebut = [];
				}
				if (!aEleve.classe.datesFin) {
					aEleve.classe.datesFin = [];
				}
				if (!aEleve.groupe) {
					aEleve.groupe = new ObjetElement("", 0);
				}
				if (!aEleve.groupe.datesDebut) {
					aEleve.groupe.datesDebut = [];
				}
				if (!aEleve.groupe.datesFin) {
					aEleve.groupe.datesFin = [];
				}
				if (!aEleve.listePeriodes) {
					aEleve.listePeriodes = new ObjetListeElements();
				}
				aEleve.listePeriodes.parcourir((aPeriodeEleve) => {
					if (
						!aPeriodeEleve.bonusMalus ||
						aPeriodeEleve.bonusMalus.getNote() === ""
					) {
						aPeriodeEleve.bonusMalus = new TypeNote("0,00");
					}
				});
				aEleve.listePeriodes.trier();
			});
			lParam.listeEleves.trier();
		}
		lParam.listeDevoirs = new ObjetListeElements();
		if (!!this.JSONReponse.listeDevoirs) {
			lParam.listeDevoirs.add(this.JSONReponse.listeDevoirs);
			const lThis = this;
			lParam.listeDevoirs.parcourir((aDevoir) => {
				aDevoir.service = _getService.call(
					lThis,
					!!aDevoir.service ? aDevoir.service.getNumero() : 0,
				);
				aDevoir.estDevoirEditable = !!aDevoir.service
					? aDevoir.service.getActif()
					: false;
				aDevoir.listeSujets = new ObjetListeElements();
				if (!!aDevoir.elmSujet) {
					aDevoir.listeSujets.addElement(aDevoir.elmSujet);
				} else if (!!aDevoir.libelleSujet) {
					aDevoir.listeSujets.addElement(
						new ObjetElement(
							aDevoir.libelleSujet,
							aDevoir.getNumero(),
							EGenreDocumentJoint.Fichier,
						),
					);
				}
				aDevoir.listeCorriges = new ObjetListeElements();
				if (!!aDevoir.elmCorrige) {
					aDevoir.listeCorriges.addElement(aDevoir.elmCorrige);
				} else if (!!aDevoir.libelleCorrige) {
					aDevoir.listeCorriges.addElement(
						new ObjetElement(
							aDevoir.libelleCorrige,
							aDevoir.getNumero(),
							EGenreDocumentJoint.Fichier,
						),
					);
				}
				if (!aDevoir.listeEleves) {
					aDevoir.listeEleves = new ObjetListeElements();
				}
				if (!aDevoir.listeClasses) {
					aDevoir.listeClasses = new ObjetListeElements();
				}
				aDevoir.listeClasses.parcourir((aClasseDevoir) => {
					if (!aClasseDevoir.listePeriodes) {
						aClasseDevoir.listePeriodes = new ObjetListeElements();
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
									new ObjetListeElements().fromJSON(
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
		lParam.listeSujets = new ObjetListeElements();
		if (!!this.JSONReponse.listeCorriges) {
			lParam.listeSujets.add(this.JSONReponse.listeSujets);
		}
		lParam.listeCorriges = new ObjetListeElements();
		if (!!this.JSONReponse.listeCorriges) {
			lParam.listeCorriges.add(this.JSONReponse.listeCorriges);
		}
		lParam.listeCategories = new ObjetListeElements();
		if (!!this.JSONReponse.listeCategories) {
			lParam.listeCategories.add(this.JSONReponse.listeCategories);
		}
		lParam.avecColNR = this.JSONReponse.avecColNR;
		this.callbackReussite.appel(lParam);
	}
}
Requetes.inscrire("PageNotes", ObjetRequetePageNotes);
function _ajouterQuestionQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	aElement.nouvellePosition = aElement.position;
	if (aJSON.listeReponses) {
		aElement.listeReponses = new ObjetListeElements().fromJSON(
			aJSON.listeReponses,
			_ajouterReponseQCM,
		);
	}
}
function _ajouterReponseQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}
function _traiterService(aService, aServicePere) {
	const lThis = this;
	if (!aService.listeEleves) {
		aService.listeEleves = new ObjetListeElements();
	}
	if (!aService.listePeriodes) {
		aService.listePeriodes = new ObjetListeElements();
	}
	aService.listePeriodes.parcourir((aPeriode) => {
		aPeriode.arrondis = [];
		aPeriode.arrondis[EGenreRessourceArrondi.EleveEtudiant] =
			aPeriode.arrondiEleve;
		aPeriode.arrondis[EGenreRessourceArrondi.ClassePromotion] =
			aPeriode.arrondiClasse;
	});
	if (this.periode.existeNumero()) {
		aService.periode = aService.listePeriodes.getElementParNumero(
			this.periode.getNumero(),
		);
	}
	if (!aService.periode) {
		aService.periode = {};
		aService.periode.moyenneParSousMatiere = false;
		aService.periode.moyenneBulletinSurClasse = false;
		aService.periode.coefficient = new TypeNote(1.0);
		aService.periode.avecDevoirSupMoy = false;
		aService.periode.avecBonusMalus = false;
		aService.periode.ponderationNotePlusHaute = new TypeNote(1.0);
		aService.periode.ponderationNotePlusBasse = new TypeNote(1.0);
		aService.periode.arrondis = [];
		aService.periode.arrondis[EGenreRessourceArrondi.EleveEtudiant] =
			new TypeArrondi(0);
		aService.periode.arrondis[EGenreRessourceArrondi.ClassePromotion] =
			new TypeArrondi(0);
	}
	if (!aService.listeServices) {
		aService.listeServices = new ObjetListeElements();
	}
	aService.listeServices.parcourir((aSousService) => {
		_traiterService.call(lThis, aSousService, aService);
	});
	aService.listeServices.trier();
	aService.avecSousService = aService.listeServices.count();
	aService.estUnServiceEnGroupe =
		!!aService.groupe && aService.groupe.existeNumero();
	if (!!aServicePere) {
		aService.pere = aServicePere;
	}
}
function _getService(aNumeroService) {
	const lService =
		!!this.servicePere && !!this.servicePere.listeServices
			? this.servicePere.listeServices.getElementParNumero(aNumeroService)
			: null;
	return lService ? lService : this.servicePere;
}
module.exports = ObjetRequetePageNotes;
