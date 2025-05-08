const { _ObjetRequeteResultat } = require("_ObjetRequeteResultat.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  UtilitaireDeserialiserPiedBulletin,
} = require("UtilitaireDeserialiserPiedBulletin.js");
class ObjetRequetePageBulletins extends _ObjetRequeteResultat {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lParam = {
      eleve: new ObjetElement(),
      classe: new ObjetElement(),
      periode: new ObjetElement(),
    };
    $.extend(lParam, aParam);
    this.JSON = {
      eleve: lParam.eleve,
      periode: lParam.periode,
      classe: lParam.classe,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = { aCopier: {}, absences: {} };
    lParam.Message = this.JSONReponse.Message;
    if (!lParam.Message) {
      lParam.aCopier.classe = this.JSONReponse.Classe;
      lParam.aCopier.strInfoDatePublication =
        this.JSONReponse.strInfoDatePublication;
      if (
        this.JSONReponse.NoteBareme !== null &&
        this.JSONReponse.NoteBareme !== undefined
      ) {
        lParam.aCopier.baremeNotationNiveau = this.JSONReponse.NoteBareme;
      }
      const lExisteServiceAvecNotes = this.JSONReponse.existeServiceAvecNotes;
      const lExisteServiceSansNotes = this.JSONReponse.existeServiceSansNotes;
      lParam.aCopier.Affichage = this.JSONReponse.ParametresAffichages;
      lParam.aCopier.Affichage.existeServiceAvecNotes = lExisteServiceAvecNotes;
      lParam.aCopier.Affichage.existeServiceSansNotes = lExisteServiceSansNotes;
      lParam.aCopier.Affichage.pourClasseAvecNotes =
        lExisteServiceAvecNotes && !lExisteServiceSansNotes;
      lParam.aCopier.Affichage.pourClasseSansNotes =
        !lExisteServiceAvecNotes && lExisteServiceSansNotes;
      if (lExisteServiceSansNotes) {
        lParam.aCopier.Affichage.posClasse =
          this.JSONReponse.TypePositionnementClasse;
      }
      this.creerListeServices(this.JSONReponse);
      lParam.aCopier.ServiceEditable = this.ServiceEditable;
      lParam.aCopier.ExisteDevoir = this.ExisteDevoir;
      lParam.aCopier.ExisteService = this.ExisteService;
      lParam.aCopier.NbrMaxServices = this.NbrMaxServices;
      lParam.aCopier.NbrMaxDevoirs = this.NbrMaxDevoirs;
      lParam.aCopier.tableauSurMatieres = this.tableauSurMatieres;
      lParam.aCopier.tableauDebutRegroupement = this.tableauDebutRegroupement;
      lParam.aCopier.ListeElements = this.ListeElements;
      lParam.aCopier.listeAnnotations = this.JSONReponse.listeAnnotations;
      lParam.aCopier.MoyenneGenerale = this.JSONReponse.General;
      lParam.aCopier.graph = this.JSONReponse.graphe;
      lParam.aCopier.baremeParDefaut = this.JSONReponse.baremeParDefaut;
      $.extend(
        lParam.absences,
        new UtilitaireDeserialiserPiedBulletin().creerAbsences(
          this.JSONReponse,
        ),
      );
      lParam.aCopier.PiedDePage =
        new UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
          this.JSONReponse,
        );
      lParam.aCopier.listeAccusesReception =
        this.JSONReponse.listeAccusesReception;
    }
    this.callbackReussite.appel(lParam);
  }
}
Requetes.inscrire("PageBulletins", ObjetRequetePageBulletins);
module.exports = { ObjetRequetePageBulletins };
