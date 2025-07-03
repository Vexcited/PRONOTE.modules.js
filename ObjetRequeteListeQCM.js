exports.ObjetRequeteListeQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequeteListeQCM extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lUtilitaireDeserialisation =
			new ObjetDeserialiser_1.ObjetDeserialiser();
		const lListeQCM = new ObjetListeElements_1.ObjetListeElements().fromJSON(
			this.JSONReponse.listeQCM,
			lUtilitaireDeserialisation._ajouterQCM.bind(lUtilitaireDeserialisation),
		);
		const lListeCategories = this.JSONReponse.listeCategories;
		const lListeServices =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				this.JSONReponse.listeServices,
				_ajouterServices,
			);
		const lListeClasses =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				this.JSONReponse.listeClasses,
				_ajouterClasses,
			);
		const lListeProfs = new ObjetListeElements_1.ObjetListeElements().fromJSON(
			this.JSONReponse.listeProfs,
		);
		const lAvecServicesEvaluation = !!this.JSONReponse.avecServicesEvaluation;
		lListeQCM.parcourir((aElement) => {
			if (
				aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.ExecutionQCM
			) {
				aElement.QCM = lListeQCM.getElementParNumero(aElement.QCM.getNumero());
			}
			if (
				aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.ExecutionQCM
			) {
				aElement.estUnDeploiement = false;
				aElement.estDeploye = true;
				aElement.pere = aElement.QCM;
				if (
					aElement.estSupprimable === false &&
					aElement.QCM.estSupprimable !== false
				) {
					aElement.QCM.estSupprimable = false;
					if (!!aElement.msgSuppression) {
						aElement.QCM.msgSuppression = aElement.msgSuppression;
					}
				}
			} else {
				aElement.estUnDeploiement = true;
				aElement.estDeploye = true;
				aElement.pere = null;
				aElement.nbExecution = lListeQCM
					.getListeElements((aEle) => {
						return aEle.QCM && aEle.QCM.getNumero() === aElement.getNumero();
					})
					.count();
				if (!!lListeCategories && !!aElement.categories) {
					const lNouvelleListe = new ObjetListeElements_1.ObjetListeElements();
					aElement.categories.parcourir((aCategorieQCM) => {
						const lCategorieDeListeGlobale =
							lListeCategories.getElementParNumero(aCategorieQCM.getNumero());
						if (!!lCategorieDeListeGlobale) {
							lNouvelleListe.add(
								MethodesObjet_1.MethodesObjet.dupliquer(
									lCategorieDeListeGlobale,
								),
							);
						}
					});
					aElement.categories = lNouvelleListe;
				}
			}
		});
		this.callbackReussite.appel(lListeQCM, {
			listeServices: lListeServices,
			listeClasses: lListeClasses,
			listeProfesseurs: lListeProfs,
			avecServicesEvaluation: lAvecServicesEvaluation,
			listeCategories: lListeCategories,
		});
	}
}
exports.ObjetRequeteListeQCM = ObjetRequeteListeQCM;
CollectionRequetes_1.Requetes.inscrire("listeQCM", ObjetRequeteListeQCM);
function _ajouterServices(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	const lListeProprietes = [
		"classe",
		"groupe",
		"matiere",
		"pere",
		"professeur",
	];
	for (const x in lListeProprietes) {
		if (aJSON[lListeProprietes[x]]) {
			aElement[lListeProprietes[x]] =
				new ObjetElement_1.ObjetElement().fromJSON(aJSON[lListeProprietes[x]]);
			aElement[lListeProprietes[x]].copieJSON(aJSON[lListeProprietes[x]]);
			if (aElement[lListeProprietes[x]].matiere) {
				aElement[lListeProprietes[x]].matiere =
					new ObjetElement_1.ObjetElement().fromJSON(
						aJSON[lListeProprietes[x]].matiere,
					);
			}
			if (aElement[lListeProprietes[x]].listePeriodes) {
				aElement[lListeProprietes[x]].listePeriodes =
					new ObjetListeElements_1.ObjetListeElements().fromJSON(
						aJSON[lListeProprietes[x]].listePeriodes,
					);
			}
		}
	}
	aElement.listePeriodes =
		new ObjetListeElements_1.ObjetListeElements().fromJSON(aJSON.listePeriodes);
	aElement.groupe.listeClasses =
		new ObjetListeElements_1.ObjetListeElements().fromJSON(
			aJSON.groupe.listeClasses,
			_ajouterClasses,
		);
	if (aJSON.classe.service) {
		aElement.classe.service = new ObjetElement_1.ObjetElement().fromJSON(
			aJSON.classe.service,
		);
	}
}
function _ajouterClasses(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	if (aJSON.service) {
		aElement.service = new ObjetElement_1.ObjetElement().fromJSON(
			aJSON.service,
		);
	}
	if (aJSON.periodeParDefaut) {
		aElement.periodeParDefaut = new ObjetElement_1.ObjetElement().fromJSON(
			aJSON.periodeParDefaut,
		);
	}
	if (aJSON.listePeriodes) {
		aElement.listePeriodes =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				aJSON.listePeriodes,
				(aJSON, aElement) => {
					aElement.Actif = aJSON.actif;
				},
			);
		aElement.listePeriodes.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Aucune"),
				0,
				0,
			),
		);
	}
}
