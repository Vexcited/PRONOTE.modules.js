const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class ObjetRequeteSuiviResultatsCompetences extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON = $.extend(
      {
        classe: null,
        periode: null,
        eleve: null,
        seuilSucces: 0,
        seuilEchecs: 0,
      },
      aParams,
    );
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (this.JSONReponse.listeCompetencesEchecs) {
      _deserialiserListeElementsCompetences(
        this.JSONReponse.listeCompetencesEchecs,
      );
    }
    if (this.JSONReponse.listeCompetencesSucces) {
      _deserialiserListeElementsCompetences(
        this.JSONReponse.listeCompetencesSucces,
      );
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire(
  "SuiviResultatsCompetences",
  ObjetRequeteSuiviResultatsCompetences,
);
function _deserialiserListeElementsCompetences(aListe) {
  if (aListe) {
    aListe.parcourir((D) => {
      if (D.listeNiveaux) {
        D.listeNiveaux.parcourir((aNiveau) => {
          Object.assign(aNiveau, _getNiveauGlobalDeGenre(aNiveau.getGenre()));
        });
        D.listeNiveauxParNiveau =
          TUtilitaireCompetences.regroupeNiveauxDAcquisitions(D.listeNiveaux);
      }
    });
  }
}
function _getNiveauGlobalDeGenre(aGenre) {
  return GParametres.listeNiveauxDAcquisitions.getElementParGenre(aGenre);
}
module.exports = { ObjetRequeteSuiviResultatsCompetences };
