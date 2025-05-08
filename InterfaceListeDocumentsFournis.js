const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  DonneesListe_ListeDocumentsFournis,
} = require("DonneesListe_ListeDocumentsFournis.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
Requetes.inscrire("ListeDocumentsParents", ObjetRequeteConsultation);
class InterfaceListeDocumentsFournis extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe);
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evntSurDernierMenuDeroulant.bind(this),
      _initTripleCombo.bind(this),
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
  }
  afficherPage() {
    this.setEtatSaisie(false);
    Requetes("ListeDocumentsParents", this, _actionApresRequete).lancerRequete({
      classe: _getClasse(),
    });
  }
}
function _getClasse() {
  return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
}
function _initTripleCombo(aInstance) {
  aInstance.setParametres([EGenreRessource.Classe]);
}
function _evntSurDernierMenuDeroulant() {
  this.afficherPage();
}
function _initialiserListe(aInstance, aListe) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_ListeDocumentsFournis.colonnes.nom,
    titre: GTraductions.getValeur("Nom"),
    taille: 200,
  });
  lColonnes.push({
    id: DonneesListe_ListeDocumentsFournis.colonnes.prenom,
    titre: GTraductions.getValeur("ListeRessources.Prenom"),
    taille: 200,
  });
  lColonnes.push({
    id: DonneesListe_ListeDocumentsFournis.colonnes.dateNaissance,
    titre: GTraductions.getValeur("ListeRessources.DateNaissance"),
    taille: 100,
  });
  if (aListe && aListe.count() > 0) {
    let i = 0;
    aListe.parcourir((aItem) => {
      lColonnes.push({
        id: "ColonneDynamique" + i,
        rangColonneDynamique: i,
        titre: aItem.getLibelle(),
        taille: 150,
      });
      i++;
    });
  }
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    colonnesTriables: true,
    largeurImage: 32,
    avecFondBlanc: true,
  });
}
function _actionApresRequete(aJSON) {
  _initialiserListe(this.getInstance(this.identListe), aJSON.listeColonnes);
  const lListe = aJSON.listeDocumentsEleves;
  const lTri = ObjetTri.init("nom");
  lListe.trier(lTri);
  this.getInstance(this.identListe).setDonnees(
    new DonneesListe_ListeDocumentsFournis(lListe),
  );
}
module.exports = { InterfaceListeDocumentsFournis };
