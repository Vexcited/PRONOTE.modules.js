const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteBulletinCompetences extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {
      classe: aParam.classe,
      periode: aParam.periode,
      eleve: aParam.eleve,
      bulletin: aParam.bulletin,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListeLignes = this.JSONReponse.listeLignes;
    if (lListeLignes) {
      lListeLignes.parcourir((aLigne) => {
        if (!!aLigne.niveauAcqComp) {
          Object.assign(
            aLigne.niveauAcqComp,
            _getNiveauAcquisitionGlobal(aLigne.niveauAcqComp),
          );
        }
        if (!!aLigne.posLSUNiveauP1) {
          Object.assign(
            aLigne.posLSUNiveauP1,
            _getNiveauAcquisitionGlobal(aLigne.posLSUNiveauP1),
          );
        }
        if (!!aLigne.posLSUNiveauP2) {
          Object.assign(
            aLigne.posLSUNiveauP2,
            _getNiveauAcquisitionGlobal(aLigne.posLSUNiveauP2),
          );
        }
        if (!!aLigne.posLSUNiveau) {
          Object.assign(
            aLigne.posLSUNiveau,
            _getNiveauAcquisitionGlobal(aLigne.posLSUNiveau),
          );
        }
        if (aLigne.listeColonnesTransv) {
          aLigne.listeColonnesTransv.parcourir((aElementColonneTransv) => {
            if (
              !!aElementColonneTransv.niveauAcqui &&
              aElementColonneTransv.niveauAcqui.existeNumero()
            ) {
              Object.assign(
                aElementColonneTransv.niveauAcqui,
                _getNiveauAcquisitionGlobal(aElementColonneTransv.niveauAcqui),
              );
            }
            if (
              !!aElementColonneTransv.niveauAcquiCalc &&
              aElementColonneTransv.niveauAcquiCalc.existeNumero()
            ) {
              Object.assign(
                aElementColonneTransv.niveauAcquiCalc,
                _getNiveauAcquisitionGlobal(
                  aElementColonneTransv.niveauAcquiCalc,
                ),
              );
            }
          });
        }
      });
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("BulletinCompetences", ObjetRequeteBulletinCompetences);
function _getNiveauAcquisitionGlobal(aNiveauAcquision) {
  return GParametres.listeNiveauxDAcquisitions.getElementParGenre(
    aNiveauAcquision.getGenre(),
  );
}
module.exports = { ObjetRequeteBulletinCompetences };
