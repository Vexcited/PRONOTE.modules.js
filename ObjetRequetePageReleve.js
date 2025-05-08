const { _ObjetRequeteResultat } = require("_ObjetRequeteResultat.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  UtilitaireDeserialiserPiedBulletin,
} = require("UtilitaireDeserialiserPiedBulletin.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequetePageReleve extends _ObjetRequeteResultat {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lParam = {
      numeroEleve: 0,
      numeroClasse: 0,
      genrePeriode: 0,
      numeroPeriode: 0,
    };
    $.extend(lParam, aParam);
    this.JSON = {
      eleve: new ObjetElement("", lParam.numeroEleve),
      periode: new ObjetElement("", lParam.numeroPeriode, lParam.genrePeriode),
    };
    if (lParam.numeroClasse) {
      this.JSON.classe = new ObjetElement("", lParam.numeroClasse);
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = { aCopier: {}, absences: {} };
    lParam.Message = this.JSONReponse.Message;
    if (!lParam.Message) {
      lParam.aCopier.classe = this.JSONReponse.Classe;
      lParam.aCopier.strInfoDatePublication =
        this.JSONReponse.strInfoDatePublication;
      lParam.aCopier.Affichage = this.JSONReponse.ParametresAffichages;
      lParam.aCopier.Affichage.listeLibellesPeriodes =
        this.JSONReponse.ListePeriodes;
      const lThis = this;
      let lDernierSousService, lPremierSousService, lPereSousService;
      const lNbrSurMatiere = this.JSONReponse.ListeSurMatieres.count();
      this.NbrMaxServices = 0;
      lParam.aCopier.ListeElements = this.JSONReponse.ListeServices.parcourir(
        (aElement) => {
          lThis.NbrMaxServices =
            !aElement.estSousService && !aElement.estSurMatiere
              ? lThis.NbrMaxServices + 1
              : lThis.NbrMaxServices;
          if (lNbrSurMatiere === 0) {
            aElement.regroupement = 0;
          }
          if (aElement.estServicePereAvecSousService) {
            lPereSousService = aElement;
            aElement.avecSousServiceAffiche = false;
          }
          if (aElement.estSousService) {
            lThis.JSONReponse.ParametresAffichages.AvecSousService = true;
            aElement.service = lPereSousService;
            lPereSousService.avecSousServiceAffiche = true;
            lDernierSousService = aElement;
            if (lPremierSousService) {
              lPremierSousService = null;
            } else {
              lPremierSousService = aElement;
            }
          } else {
            if (lDernierSousService) {
              lDernierSousService.estDernier = true;
            }
            if (lPremierSousService) {
              lPremierSousService = null;
            }
          }
        },
      );
      if (lDernierSousService) {
        lDernierSousService.estDernier = true;
      }
      if (lPremierSousService) {
        lPremierSousService = null;
      }
      lParam.aCopier.ServiceEditable = this.JSONReponse.Editable;
      lParam.aCopier.ExisteDevoir = this.JSONReponse.NbrMaxDevoirs > 0;
      lParam.aCopier.ExisteService = this.NbrMaxServices > 0;
      lParam.aCopier.NbrMaxServices = this.NbrMaxServices;
      lParam.aCopier.NbrMaxDevoirs = this.JSONReponse.NbrMaxDevoirs;
      const lTabSurMatiere = [];
      this.JSONReponse.ListeSurMatieres.parcourir((aSurMatiere) => {
        let lAvecServiceDansSurMatiere = false;
        let lDernierServiceDansSurMatiere;
        lParam.aCopier.ListeElements.parcourir((aElement) => {
          if (
            aSurMatiere.getNumero() === aElement.SurMatiere.getNumero() &&
            aSurMatiere.getNumero() !== aElement.getNumero()
          ) {
            lAvecServiceDansSurMatiere = true;
            lDernierServiceDansSurMatiere = aElement;
          } else {
            if (lDernierServiceDansSurMatiere) {
              lDernierServiceDansSurMatiere.estDernierDansSurMatiere = true;
            }
          }
        });
        if (lDernierServiceDansSurMatiere) {
          lDernierServiceDansSurMatiere.estDernierDansSurMatiere = true;
        }
        if (lAvecServiceDansSurMatiere) {
          lTabSurMatiere[aSurMatiere.getNumero()] = aSurMatiere;
        } else {
          const lListe = new ObjetListeElements();
          for (
            let i = 0, lNbr = lParam.aCopier.ListeElements.count();
            i < lNbr;
            i++
          ) {
            if (
              aSurMatiere.getNumero() !==
              lParam.aCopier.ListeElements.get(i).getNumero()
            ) {
              lListe.addElement(lParam.aCopier.ListeElements.get(i));
            }
          }
          lParam.aCopier.ListeElements = lListe;
        }
      });
      lParam.aCopier.tableauSurMatieres = lTabSurMatiere;
      lParam.aCopier.MoyenneGenerale = this.JSONReponse.General;
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
      lParam.listeAccusesReception = this.JSONReponse.listeAccusesReception;
    }
    this.callbackReussite.appel(lParam);
  }
}
Requetes.inscrire("PageReleve", ObjetRequetePageReleve);
module.exports = { ObjetRequetePageReleve };
