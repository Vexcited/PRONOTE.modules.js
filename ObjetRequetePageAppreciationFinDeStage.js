const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequetePageAppreciationFinDeStage extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  actionApresRequete() {
    const lStage = this.JSONReponse.stage ? this.JSONReponse.stage : null;
    if (!!lStage) {
      lStage.appreciations = new ObjetListeElements();
      lStage.maitreDeStage.parcourir((aMaitreDeStage) => {
        const lElmAppreciation = new ObjetElement(
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
        const lRespProf = new ObjetElement(
          GTraductions.getValeur("Professeurs"),
          -1,
          -1,
          1,
        );
        lRespProf.estProfFiltrable = true;
        lRespProf.estUnDeploiement = true;
        lRespProf.estDeploye = true;
        const lRespPers = new ObjetElement(
          GTraductions.getValeur("Personnels"),
          -1,
          -1,
          3,
        );
        lRespPers.estPersonnelFiltrable = true;
        lRespPers.estUnDeploiement = true;
        lRespPers.estDeploye = true;
        let lIndicePremierPersonnel = 0;
        lStage.listeResponsables.parcourir((aResp, aIndice) => {
          if (aResp.getGenre() === EGenreRessource.Enseignant) {
            aResp.pere = lRespProf;
            aResp.estProf = true;
          } else if (aResp.getGenre() === EGenreRessource.Personnel) {
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
          new ObjetElement(GTraductions.getValeur("Aucun"), 0, -1, 0),
          0,
        );
        lStage.respAdminCBFiltrage = {
          cbProfEquipePeda: GTraductions.getValeur(
            "FicheStage.fenetreRespAdmin.cbProfEquipePeda",
          ),
          cbPersConcernes: GTraductions.getValeur(
            "FicheStage.fenetreRespAdmin.cbPersConcernes",
          ),
        };
      }
      lStage.maitreDeStage.trier();
      lStage.professeur.parcourir((aProfesseur) => {
        const lElmAppreciation = new ObjetElement(
          aProfesseur.Libelle,
          aProfesseur.Numero,
          aProfesseur.Genre,
        );
        lElmAppreciation.avecEditionAppreciation =
          aProfesseur.avecEditionAppreciation;
        lElmAppreciation.appreciation = aProfesseur.appreciation;
        lStage.appreciations.addElement(lElmAppreciation);
      });
      lStage.professeur.trier();
      lStage.suiviStage.setTri([
        ObjetTri.init("date"),
        ObjetTri.init("Libelle"),
        ObjetTri.init("Numero"),
      ]);
      lStage.suiviStage.trier();
    }
    const lListePJEleve = this.JSONReponse.listeDJEleve
      ? this.JSONReponse.listeDJEleve
      : new ObjetListeElements();
    this.callbackReussite.appel({ stage: lStage, listePJEleve: lListePJEleve });
  }
}
Requetes.inscrire(
  "PageAppreciationFinDeStage",
  ObjetRequetePageAppreciationFinDeStage,
);
module.exports = { ObjetRequetePageAppreciationFinDeStage };
