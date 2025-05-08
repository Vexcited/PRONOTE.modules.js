const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreDocTelechargement } = require("Enumere_DocTelechargement.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetRequeteDocumentsATelecharger extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = Object.assign(
      { avecNotes: false, avecCompetences: false, listeElevesBIA: undefined },
      aParam,
    );
    if (
      this.JSON.listeElevesBIA &&
      this.JSON.listeElevesBIA.setSerialisateurJSON
    ) {
      this.JSON.listeElevesBIA.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListe = new ObjetListeElements();
    const lListeCategorie = new ObjetListeElements();
    const Llistebulletin = new ObjetListeElements();
    const lListeDocument = new ObjetListeElements();
    const lListeDocumentAFournir = new ObjetListeElements();
    let lDiplome;
    let lElement;
    if (
      this.JSONReponse.listeDocuments &&
      this.JSONReponse.listeDocuments.count() > 0
    ) {
      this.JSONReponse.listeDocuments.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.documents,
          document: aDocument,
          estNonLu: true,
          Genre: 0,
        });
        lListe.addElement(lElement);
        lListeDocument.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeDocumentsMembre &&
      this.JSONReponse.listeDocumentsMembre.count() > 0
    ) {
      this.JSONReponse.listeDocumentsMembre.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.documentMembre,
          document: aDocument,
          estNonLu: true,
          Genre: 0,
        });
        lListe.addElement(lElement);
        lListeDocument.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeProjetsAcc &&
      this.JSONReponse.listeProjetsAcc.count() > 0
    ) {
      this.JSONReponse.listeProjetsAcc.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.projetAcc,
          projet: aDocument,
          estNonLu: true,
          Genre: 0,
        });
        lListe.addElement(lElement);
        lListeDocument.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeBulletinsBIA &&
      this.JSONReponse.listeBulletinsBIA.count() > 0
    ) {
      this.JSONReponse.listeBulletinsBIA.parcourir((aBulletin) => {
        lElement = new ObjetElement();
        lElement.typeDocument = EGenreDocTelechargement.bulletinBIA;
        lElement.bulletin = aBulletin;
        lElement.annee = aBulletin.annee;
        lElement.Genre = 0;
        lListe.addElement(lElement);
        Llistebulletin.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeBulletins &&
      this.JSONReponse.listeBulletins.count() > 0
    ) {
      this.JSONReponse.listeBulletins.parcourir((aBulletin) => {
        const lElement = Object.assign(aBulletin, {
          Genre: 0,
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.bulletin,
        });
        lListe.addElement(lElement);
        Llistebulletin.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeCategories &&
      this.JSONReponse.listeCategories.count() > 0
    ) {
      this.JSONReponse.listeCategories.parcourir((aCategorie) =>
        lListeCategorie.add(aCategorie),
      );
    }
    if (
      this.JSONReponse.listeDocumentsCasier &&
      this.JSONReponse.listeDocumentsCasier.count() > 0
    ) {
      this.JSONReponse.listeDocumentsCasier.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          Genre: 0,
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.documentCasier,
        });
        lListe.addElement(lElement);
        lListeDocument.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeNaturesDocumentsAFournir &&
      this.JSONReponse.listeNaturesDocumentsAFournir.count() > 0
    ) {
      this.JSONReponse.listeNaturesDocumentsAFournir.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          Genre: 0,
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.documentAFournir,
        });
        lListe.addElement(lElement);
        lListeDocumentAFournir.addElement(lElement);
      });
    }
    if (
      this.JSONReponse.listeBilansPeriodiques &&
      this.JSONReponse.listeBilansPeriodiques.count() > 0
    ) {
      this.JSONReponse.listeBilansPeriodiques.parcourir((aDocument) => {
        const lElement = Object.assign(aDocument, {
          Genre: 0,
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.bulletinDeCompetences,
        });
        lListe.addElement(lElement);
        Llistebulletin.addElement(lElement);
      });
    }
    if (this.JSONReponse.diplome) {
      lDiplome = Object.assign(
        MethodesObjet.dupliquer(this.JSONReponse.diplome),
        {
          Genre: 0,
          annee: GParametres.PremiereDate.getFullYear(),
          typeDocument: EGenreDocTelechargement.diplome,
        },
      );
    }
    const lTri = [
      ObjetTri.init("annee", EGenreTriElement.Decroissant),
      ObjetTri.init("debutPeriodeNotation"),
      ObjetTri.init("libelleClasse"),
      ObjetTri.init("Libelle"),
    ];
    lListe.setTri(lTri).trier();
    lListeCategorie.setTri(lTri).trier();
    lListeDocument.setTri(lTri).trier();
    lListeDocumentAFournir.setTri(lTri).trier();
    Llistebulletin.setTri(lTri).trier();
    const lOptions = {
      liste: lListe,
      listeCategories: lListeCategorie,
      listeDocuments: lListeDocument,
      listeDocumentsAFournir: lListeDocumentAFournir,
      listebulletins: Llistebulletin,
    };
    if (lDiplome) {
      lOptions.diplome = lDiplome;
    }
    this.callbackReussite.appel(lOptions);
  }
}
Requetes.inscrire("DocumentsATelecharger", ObjetRequeteDocumentsATelecharger);
module.exports = { ObjetRequeteDocumentsATelecharger };
