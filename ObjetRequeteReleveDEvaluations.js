exports.ObjetRequeteReleveDEvaluations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteReleveDEvaluations extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = lApplicationSco.getObjetParametres();
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeEleves = this.JSONReponse.listeEleves;
		if (lListeEleves) {
			lListeEleves.parcourir((aEleve) => {
				if (!!aEleve.simulations) {
					aEleve.simulations.parcourir((aNiveau) => {
						const lNiveauGlobal = this._getNiveauGlobalDeGenre(
							aNiveau.getGenre(),
						);
						Object.assign(aNiveau, lNiveauGlobal);
					});
				}
				if (!!aEleve.posLSUNiveau) {
					const lNiveauAcquiGlobal = this._getNiveauGlobalDeGenre(
						aEleve.posLSUNiveau.getGenre(),
					);
					Object.assign(aEleve.posLSUNiveau, lNiveauAcquiGlobal);
				}
				if (!!aEleve.posPrecedents) {
					aEleve.posPrecedents.parcourir((aNiveau) => {
						const lNiveauGlobal = this._getNiveauGlobalDeGenre(
							aNiveau.getGenre(),
						);
						Object.assign(aNiveau, lNiveauGlobal);
					});
				}
				if (!!aEleve.nivAcquiPilier) {
					const lNiveauAcquiGlobal = this._getNiveauGlobalDeGenre(
						aEleve.nivAcquiPilier.getGenre(),
					);
					Object.assign(aEleve.nivAcquiPilier, lNiveauAcquiGlobal);
				}
				if (aEleve.listeNiveauxDAcquisitions) {
					aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
						const lNiveauGlobal = this._getNiveauGlobalDeGenre(
							aNiveau.getGenre(),
						);
						Object.assign(aNiveau, lNiveauGlobal);
					});
				}
				if (aEleve.listeValeursColonnesLSL) {
					aEleve.listeValeursColonnesLSL.parcourir((aValeurColonneLSL) => {
						if (aValeurColonneLSL) {
							if (aValeurColonneLSL.niveau) {
								const lNiveauGlobal = this._getNiveauGlobalDeGenre(
									aValeurColonneLSL.niveau.getGenre(),
								);
								Object.assign(aValeurColonneLSL.niveau, lNiveauGlobal);
							}
							if (aValeurColonneLSL.niveauMoyenne) {
								const lNiveauMoyenneGlobal = this._getNiveauGlobalDeGenre(
									aValeurColonneLSL.niveauMoyenne.getGenre(),
								);
								Object.assign(
									aValeurColonneLSL.niveauMoyenne,
									lNiveauMoyenneGlobal,
								);
							}
							if (aValeurColonneLSL.listeNiveauxDAcquisitions) {
								aValeurColonneLSL.listeNiveauxDAcquisitions.parcourir(
									(aNiveau) => {
										const lNiveauGlobal = this._getNiveauGlobalDeGenre(
											aNiveau.getGenre(),
										);
										Object.assign(aNiveau, lNiveauGlobal);
									},
								);
							}
						}
					});
				}
			});
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
	_getNiveauGlobalDeGenre(aGenre) {
		return this.parametresSco.listeNiveauxDAcquisitions.getElementParGenre(
			aGenre,
		);
	}
}
exports.ObjetRequeteReleveDEvaluations = ObjetRequeteReleveDEvaluations;
CollectionRequetes_1.Requetes.inscrire(
	"ReleveDEvaluations",
	ObjetRequeteReleveDEvaluations,
);
(function (ObjetRequeteReleveDEvaluations) {
	let TypeAffichage;
	(function (TypeAffichage) {
		TypeAffichage[(TypeAffichage["AffichageParService"] = 0)] =
			"AffichageParService";
		TypeAffichage[(TypeAffichage["AffichageParClasse"] = 1)] =
			"AffichageParClasse";
	})(
		(TypeAffichage =
			ObjetRequeteReleveDEvaluations.TypeAffichage ||
			(ObjetRequeteReleveDEvaluations.TypeAffichage = {})),
	);
})(
	ObjetRequeteReleveDEvaluations ||
		(exports.ObjetRequeteReleveDEvaluations = ObjetRequeteReleveDEvaluations =
			{}),
);
