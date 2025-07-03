exports.ObjetRequetePageAppreciationFinDeStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequetePageAppreciationFinDeStage extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lStage = this.JSONReponse.stage ? this.JSONReponse.stage : null;
		if (!!lStage) {
			lStage.appreciations = new ObjetListeElements_1.ObjetListeElements();
			lStage.maitreDeStage.parcourir((aMaitreDeStage) => {
				const lElmAppreciation = new ObjetElement_1.ObjetElement(
					aMaitreDeStage.Libelle,
					aMaitreDeStage.Numero,
					aMaitreDeStage.Genre,
				);
				lElmAppreciation.avecEditionAppreciation =
					aMaitreDeStage.avecEditionAppreciation;
				lElmAppreciation.appreciation = aMaitreDeStage.appreciation;
				lStage.appreciations.addElement(lElmAppreciation);
			});
			if (lStage.listeResponsables) {
				const lRespProf = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
					-1,
					-1,
					1,
				);
				lRespProf.estProfFiltrable = true;
				lRespProf.estUnDeploiement = true;
				lRespProf.estDeploye = true;
				const lRespPers = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Personnels"),
					-1,
					-1,
					3,
				);
				lRespPers.estPersonnelFiltrable = true;
				lRespPers.estUnDeploiement = true;
				lRespPers.estDeploye = true;
				let lIndicePremierPersonnel = 0;
				lStage.listeResponsables.parcourir((aResp, aIndice) => {
					if (
						aResp.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant
					) {
						aResp.pere = lRespProf;
						aResp.estProf = true;
					} else if (
						aResp.getGenre() === Enumere_Ressource_1.EGenreRessource.Personnel
					) {
						aResp.pere = lRespPers;
						aResp.estPersonnel = true;
						if (lIndicePremierPersonnel === 0) {
							lIndicePremierPersonnel = aIndice;
						}
					}
					aResp.estUnDeploiement = false;
					aResp.estDeploye = true;
				});
				lStage.listeResponsables.insererElement(
					lRespPers,
					lIndicePremierPersonnel,
				);
				lStage.listeResponsables.insererElement(lRespProf, 0);
				lStage.listeResponsables.insererElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						0,
						-1,
						0,
					),
					0,
				);
				lStage.respAdminCBFiltrage = {
					cbProfEquipePeda: ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.fenetreRespAdmin.cbProfEquipePeda",
					),
					cbPersConcernes: ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.fenetreRespAdmin.cbPersConcernes",
					),
				};
			}
			lStage.maitreDeStage.trier();
			lStage.referents.parcourir((aReferent) => {
				const lElmAppreciation = new ObjetElement_1.ObjetElement(
					aReferent.Libelle,
					aReferent.Numero,
					aReferent.Genre,
				);
				lElmAppreciation.avecEditionAppreciation =
					aReferent.avecEditionAppreciation;
				lElmAppreciation.appreciation = aReferent.appreciation;
				lStage.appreciations.addElement(lElmAppreciation);
			});
			lStage.referents.trier();
			lStage.suiviStage.setTri([
				ObjetTri_1.ObjetTri.init("date"),
				ObjetTri_1.ObjetTri.init("Libelle"),
				ObjetTri_1.ObjetTri.init("Numero"),
			]);
			lStage.suiviStage.trier();
		}
		const lListePJEleve = this.JSONReponse.listeDJEleve
			? this.JSONReponse.listeDJEleve
			: new ObjetListeElements_1.ObjetListeElements();
		this.callbackReussite.appel({ stage: lStage, listePJEleve: lListePJEleve });
	}
}
exports.ObjetRequetePageAppreciationFinDeStage =
	ObjetRequetePageAppreciationFinDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"PageAppreciationFinDeStage",
	ObjetRequetePageAppreciationFinDeStage,
);
