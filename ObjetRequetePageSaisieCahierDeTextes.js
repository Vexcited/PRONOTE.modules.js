exports.ObjetRequetePageSaisieCahierDeTextes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequetePageSaisieCahierDeTextes extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParam) {
    this.JSON = {
      cours: new ObjetElement_1.ObjetElement(),
      numeroSemaine: 0,
      avecJoursPresence: true,
      avecCDT: true,
    };
    $.extend(this.JSON, aParam);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = {
      DateCoursDeb: null,
      DateCoursFin: null,
      DateTravailAFaire: null,
      listeClassesEleves: new ObjetListeElements_1.ObjetListeElements(),
      nombresDEleves: 0,
      CoursPrecedent: null,
      CoursSuivant: null,
      dateCoursSuivantTAF: null,
      JoursPresenceCours: null,
      listeCDTsPrecedents: null,
      contenuProgressionSuivant: null,
      ListeDocumentsJoints: null,
      CahierDeTextes: null,
      avecElementsProgramme: false,
      voirTousLeCDTetCharge: false,
    };
    $.extend(lParam, this.JSONReponse);
    GEtatUtilisateur.estEligibleParcours = this.JSONReponse.estEligibleParcours;
    if (!!lParam.listeClassesEleves) {
      lParam.listeClassesEleves.parcourir((aClasse) => {
        if (!!aClasse.listeEleves) {
          aClasse.listeEleves.trier();
          aClasse.listeEleves.parcourir((aEleveDeLaClasse) => {
            aEleveDeLaClasse.classes =
              new ObjetListeElements_1.ObjetListeElements().addElement(aClasse);
          });
          lParam.nombresDEleves += aClasse.listeEleves.count();
        }
      });
    }
    if (!!lParam.ListeDocumentsJoints) {
      lParam.ListeDocumentsJoints.parcourir((aDocumentJoint) => {
        aDocumentJoint.PourMemeMatiere = aDocumentJoint.PourMatiere;
        aDocumentJoint.PourMemeClasseEtGroupe = aDocumentJoint.PourClasse;
      });
    }
    lParam.CahierDeTextes = new ObjetElement_1.ObjetElement();
    if (
      !!this.JSONReponse.listeCahiersDeTexte &&
      this.JSONReponse.listeCahiersDeTexte.count() > 0
    ) {
      lParam.CahierDeTextes = this.JSONReponse.listeCahiersDeTexte.get(0);
    }
    if (!!lParam.CahierDeTextes) {
      new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
        lParam.CahierDeTextes,
      );
    }
    if (lParam.listeCDTsPrecedents) {
      lParam.listeCDTsPrecedents
        .setTri([
          ObjetTri_1.ObjetTri.init("date"),
          ObjetTri_1.ObjetTri.init("Libelle"),
        ])
        .trier();
    }
    this.callbackReussite.appel(lParam);
  }
}
exports.ObjetRequetePageSaisieCahierDeTextes =
  ObjetRequetePageSaisieCahierDeTextes;
CollectionRequetes_1.Requetes.inscrire(
  "PageSaisieCahierDeTextes",
  ObjetRequetePageSaisieCahierDeTextes,
);
