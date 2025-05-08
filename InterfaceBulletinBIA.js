const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetDocumentsATelecharger } = require("ObjetDocumentsATelecharger.js");
const {
  ObjetRequeteDocumentsATelecharger,
} = require("ObjetRequeteDocumentsATelecharger.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { InterfacePageCP } = require("ObjetInterfacePageCP.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { tag } = require("tag.js");
Requetes.inscrire("ListeElevesBIA", ObjetRequeteConsultation);
class InterfaceBulletinBIA extends InterfacePageCP {
  constructor(...aParams) {
    super(...aParams);
    this.documentAffecteParAction = null;
    this.avecSelecteurEleve =
      IE.estMobile &&
      GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur;
  }
  construireInstances() {
    if (this.avecSelecteurEleve) {
      this.identSelection = this.add(ObjetSelection, _evenementSelection);
      this.AddSurZone = [this.identSelection];
    }
    this.identDocuments = this.add(ObjetDocumentsATelecharger);
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  construireStructureAffichage() {
    this.construireStructureAffichageBandeau();
    const lStyle = `height:100%;width:100%;max-width:${!IE.estMobile ? "45rem" : "100%"}`;
    return tag("div", {
      style: lStyle,
      id: this.getNomInstance(this.identDocuments),
    });
  }
  recupererDonnees() {
    if (this.avecSelecteurEleve) {
      _requeteListeEleve.call(this);
    } else {
      _requeteDocuments.call(this);
    }
  }
}
function _evenementSelection(aParam) {
  _requeteDocuments.call(this, aParam.element.listeElevesBIA);
}
function _requeteDocuments(aListeElevesBIA) {
  this.listeDocs = null;
  const lAvecListeElevesBIA =
    aListeElevesBIA &&
    [EGenreOnglet.BulletinAnneesPrec_Note].includes(
      GEtatUtilisateur.getGenreOnglet(),
    ) &&
    this.avecSelecteurEleve;
  return new ObjetRequeteDocumentsATelecharger(this)
    .lancerRequete({
      avecNotes: [EGenreOnglet.BulletinAnneesPrec_Note].includes(
        GEtatUtilisateur.getGenreOnglet(),
      ),
      avecCompetences: [EGenreOnglet.BulletinAnneesPrec_Competence].includes(
        GEtatUtilisateur.getGenreOnglet(),
      ),
      listeElevesBIA: lAvecListeElevesBIA && aListeElevesBIA,
    })
    .then((aDonnees) => {
      this.listeDocs = aDonnees.liste;
      this.getInstance(this.identDocuments).setDonnees({
        listeDocs: aDonnees.liste,
      });
    });
}
function _requeteListeEleve() {
  Requetes("ListeElevesBIA", this)
    .lancerRequete()
    .then((aJSON) => {
      const lListe = aJSON.liste || new ObjetListeElements();
      lListe
        .parcourir((aEleve) => {
          aEleve.Libelle = aEleve.nom + " " + aEleve.prenom;
        })
        .setTri([ObjetTri.init("nom"), ObjetTri.init("prenom")])
        .trier();
      this.getInstance(this.identSelection).setVisible(lListe.count() > 0);
      if (lListe.count() === 0) {
        this.afficher(
          this.composeAucuneDonnee(
            GTraductions.getValeur("DocumentsATelecharger.Aucun"),
          ),
        );
      } else {
        this.getInstance(this.identSelection).setDonnees(lListe, 0, "", "");
      }
    });
}
module.exports = { InterfaceBulletinBIA };
