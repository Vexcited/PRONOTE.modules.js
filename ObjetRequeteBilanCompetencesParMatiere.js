exports.ObjetRequeteBilanCompetencesParMatiere = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteBilanCompetencesParMatiere extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = lApplicationSco.getObjetParametres();
	}
	lancerRequete(aParams) {
		this.JSON = $.extend({ classe: null, periode: null, eleve: null }, aParams);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse) {
			this._deserialiserListeElementsCompetences(
				this.JSONReponse.listeCompetences,
			);
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
	_deserialiserListeElementsCompetences(aListe) {
		if (aListe) {
			aListe.parcourir((D) => {
				if (D.listeNiveaux) {
					D.listeNiveaux.parcourir((aNiveau) => {
						Object.assign(
							aNiveau,
							this._getNiveauGlobalDeGenre(aNiveau.getGenre()),
						);
					});
					D.listeNiveauxParNiveau =
						UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
							D.listeNiveaux,
						);
				}
				if (D.listeColonnesServices) {
					D.listeColonnesServices.parcourir((aColonneService) => {
						if (aColonneService.listeNiveaux) {
							aColonneService.listeNiveaux.parcourir((aNiveau) => {
								Object.assign(
									aNiveau,
									this._getNiveauGlobalDeGenre(aNiveau.getGenre()),
								);
							});
							aColonneService.listeNiveauxParNiveau =
								UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
									aColonneService.listeNiveaux,
								);
						}
						if (aColonneService.niveauAcqui) {
							aColonneService.niveauAcqui = this._getNiveauGlobalDeGenre(
								aColonneService.niveauAcqui.getGenre(),
							);
						}
						if (aColonneService.niveauAcquiMoyenne) {
							aColonneService.niveauAcquiMoyenne = this._getNiveauGlobalDeGenre(
								aColonneService.niveauAcquiMoyenne.getGenre(),
							);
						}
					});
				}
			});
		}
	}
	_getNiveauGlobalDeGenre(aGenre) {
		return this.parametresSco.listeNiveauxDAcquisitions.getElementParGenre(
			aGenre,
		);
	}
}
exports.ObjetRequeteBilanCompetencesParMatiere =
	ObjetRequeteBilanCompetencesParMatiere;
CollectionRequetes_1.Requetes.inscrire(
	"BilanCompetencesParMatiere",
	ObjetRequeteBilanCompetencesParMatiere,
);
