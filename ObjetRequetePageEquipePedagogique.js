const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequetePageEquipePedagogique extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lAvecEnseignant,
      lAvecEnseignantEnleve,
      lAvecPersonnel,
      lCumulProf,
      lCumulEnleve,
      lCumulPersonnel;
    const lListe = this.JSONReponse.liste;
    lCumulProf = new ObjetElement(
      GTraductions.getValeur("EquipePedagogique.professeursDEquipe"),
    );
    lCumulProf.Genre = EGenreRessource.Enseignant;
    lCumulProf.estUnDeploiement = true;
    lCumulProf.estDeploye = true;
    lCumulEnleve = new ObjetElement(
      GTraductions.getValeur("EquipePedagogique.autresProfesseursDEquipe"),
    );
    lCumulEnleve.Genre = EGenreRessource.Enseignant;
    lCumulEnleve.estUnDeploiement = true;
    lCumulEnleve.estDeploye = true;
    lCumulEnleve.estEnleve = true;
    lCumulPersonnel = new ObjetElement(
      GTraductions.getValeur("EquipePedagogique.personnelsDEquipe"),
    );
    lCumulPersonnel.Genre = EGenreRessource.Personnel;
    lCumulPersonnel.estUnDeploiement = true;
    lCumulPersonnel.estDeploye = true;
    lListe.parcourir((aElement) => {
      if (
        aElement.getGenre() === EGenreRessource.Enseignant &&
        !aElement.estEnleve
      ) {
        lAvecEnseignant = true;
        aElement.pere = lCumulProf;
      }
      if (
        aElement.getGenre() === EGenreRessource.Enseignant &&
        aElement.estEnleve
      ) {
        lAvecEnseignantEnleve = true;
        aElement.pere = lCumulEnleve;
      }
      if (aElement.getGenre() === EGenreRessource.Personnel) {
        lAvecPersonnel = true;
        aElement.pere = lCumulPersonnel;
      }
      if (aElement.matieres) {
        aElement.matieres.setTri([
          ObjetTri.init((D) => {
            return D.estUneSousMatiere ? D.libelleMatiere : D.getLibelle();
          }),
          ObjetTri.init((D) => {
            return !!D.estUneSousMatiere;
          }),
          ObjetTri.init("Libelle"),
        ]);
        aElement.matieres.trier();
      }
    });
    if (lAvecEnseignant && (lAvecEnseignantEnleve || lAvecPersonnel)) {
      lListe.addElement(lCumulProf);
    }
    if (lAvecEnseignantEnleve) {
      lListe.addElement(lCumulEnleve);
    }
    if (lAvecPersonnel) {
      lListe.addElement(lCumulPersonnel);
    }
    this.callbackReussite.appel(lListe);
  }
}
Requetes.inscrire("PageEquipePedagogique", ObjetRequetePageEquipePedagogique);
module.exports = { ObjetRequetePageEquipePedagogique };
