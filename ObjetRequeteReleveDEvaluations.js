const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteReleveDEvaluations extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
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
            const lNiveauGlobal = _getNiveauGlobalDeGenre(aNiveau.getGenre());
            Object.assign(aNiveau, lNiveauGlobal);
          });
        }
        if (!!aEleve.posLSUNiveau) {
          const lNiveauAcquiGlobal = _getNiveauGlobalDeGenre(
            aEleve.posLSUNiveau.getGenre(),
          );
          Object.assign(aEleve.posLSUNiveau, lNiveauAcquiGlobal);
        }
        if (!!aEleve.posPrecedents) {
          aEleve.posPrecedents.parcourir((aNiveau) => {
            const lNiveauGlobal = _getNiveauGlobalDeGenre(aNiveau.getGenre());
            Object.assign(aNiveau, lNiveauGlobal);
          });
        }
        if (!!aEleve.nivAcquiPilier) {
          const lNiveauAcquiGlobal = _getNiveauGlobalDeGenre(
            aEleve.nivAcquiPilier.getGenre(),
          );
          Object.assign(aEleve.nivAcquiPilier, lNiveauAcquiGlobal);
        }
        if (aEleve.listeNiveauxDAcquisitions) {
          aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
            const lNiveauGlobal = _getNiveauGlobalDeGenre(aNiveau.getGenre());
            Object.assign(aNiveau, lNiveauGlobal);
          });
        }
        if (aEleve.listeValeursColonnesLSL) {
          aEleve.listeValeursColonnesLSL.parcourir((aValeurColonneLSL) => {
            if (aValeurColonneLSL) {
              if (aValeurColonneLSL.niveau) {
                const lNiveauGlobal = _getNiveauGlobalDeGenre(
                  aValeurColonneLSL.niveau.getGenre(),
                );
                Object.assign(aValeurColonneLSL.niveau, lNiveauGlobal);
              }
              if (aValeurColonneLSL.niveauMoyenne) {
                const lNiveauMoyenneGlobal = _getNiveauGlobalDeGenre(
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
                    const lNiveauGlobal = _getNiveauGlobalDeGenre(
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
}
Requetes.inscrire("ReleveDEvaluations", ObjetRequeteReleveDEvaluations);
function _getNiveauGlobalDeGenre(aGenre) {
  return GParametres.listeNiveauxDAcquisitions.getElementParGenre(aGenre);
}
module.exports = { ObjetRequeteReleveDEvaluations };
