const { EGenreEvntActu } = require("EGenreEvntActu.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  ObjetRequeteSaisieActualites,
} = require("ObjetRequeteSaisieActualites.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { Toast, ETypeToast } = require("Toast.js");
const {
  ObjetRequeteListeSondagesDeBiblioEtablissement,
} = require("ObjetRequeteListeSondagesDeBiblioEtablissement.js");
const {
  ObjetFenetre_SelectionModeleInfoSond,
} = require("ObjetFenetre_SelectionModeleInfoSond.js");
const {
  DonneesListeSondagesBiblio,
} = require("DonneesListe_SondagesBiblio.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
class ObjetMoteurActus {
  constructor(...aParams) {
    this.moteurCP = new MoteurInfoSondage(...aParams);
  }
  surEvntSaisieReponseActu(aActualite, aGenreEvnt, aParam) {
    if (aGenreEvnt === EGenreEvntActu.SurValidationSondage) {
      aParam.avecMsgConfirm = true;
    }
    this.declencherSaisieDirecte(aActualite, aGenreEvnt, aParam);
  }
  declencherSaisieDirecte(aActualite, aGenreEvnt, aParam) {
    const lListeActualites = new ObjetListeElements();
    lListeActualites.addElement(aActualite);
    const lObjetSaisie = {
      listeActualite: lListeActualites,
      validationDirecte: true,
      saisieActualite: aParam.modeAuteur,
    };
    new ObjetRequeteSaisieActualites(
      this,
      this._reponseSaisieDirecte.bind(this, aActualite, aGenreEvnt, aParam),
    ).lancerRequete(lObjetSaisie);
  }
  _reponseSaisieDirecte(aActualite, aGenreEvnt, aParam) {
    let lMessage, lIcon;
    switch (aGenreEvnt) {
      case EGenreEvntActu.SurValidationSondage:
        lMessage = GTraductions.getValeur("actualites.msgConfirmValidation", [
          GDate.formatDate(aActualite.dateFin, "%J/%MM/%AAAA"),
        ]);
        lIcon = "icon_diffuser_sondage";
        break;
      case EGenreEvntActu.SurAR:
        lMessage = GTraductions.getValeur("infoSond.msgSurAR");
        lIcon = null;
        break;
      default:
        lMessage = "";
    }
    if (lMessage !== "") {
      Toast.afficher({ msg: lMessage, type: ETypeToast.succes, icon: lIcon });
      this._surConfirmReponseSaisieDirecte(aParam);
    } else {
      this._surConfirmReponseSaisieDirecte(aParam);
    }
  }
  _surConfirmReponseSaisieDirecte(aParam) {
    if (!!aParam.avecRecupDonnees) {
      aParam.clbckRecupDonnees.call(aParam.pereRecupDonnees);
    }
  }
  getListeModeles(aParam) {
    new ObjetRequeteListeSondagesDeBiblioEtablissement(
      this,
      _surReceptionListeSondageDeBiblioEtablissement.bind(this, aParam),
    ).lancerRequete({ estCasSondage: aParam.estCasSondage });
  }
}
function _surReceptionListeSondageDeBiblioEtablissement(aParam, aJSON) {
  if (!!aJSON && !!aJSON.listeModeles && aJSON.listeModeles.count() > 0) {
    const lListeModelesPourObjetListe = new ObjetListeElements();
    aJSON.listeModeles.setTri([ObjetTri.init("Libelle")]);
    aJSON.listeModeles.trier();
    aJSON.listeModeles.parcourir((aModele) => {
      aModele.estUnDeploiement = true;
      aModele.estDeploye = false;
      aModele.estModele = true;
      aModele.estSondage = aParam.estCasSondage;
      aModele.estInformation = !aModele.estSondage;
      aModele.visible = true;
      lListeModelesPourObjetListe.addElement(aModele);
      if (!!aModele.listeQuestions) {
        const lLibelleDetailSondage = [];
        aModele.listeQuestions.parcourir((aQuestion, aIndexQuestion) => {
          lLibelleDetailSondage.push(
            this.moteurCP.composeComposanteSondage({
              instance: this,
              actu: aModele,
              composante: aQuestion,
              indice: aIndexQuestion,
              avecLibelleQuestion: false,
              estAffEditionActualite: true,
            }),
          );
        });
        const lDetailSondage = new ObjetElement(lLibelleDetailSondage.join(""));
        lDetailSondage.pere = aModele;
        lDetailSondage.visible = true;
        lListeModelesPourObjetListe.addElement(lDetailSondage);
      }
    });
    const lFenetreListeModeles = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionModeleInfoSond,
      {
        pere: this,
        evenement: function (aGenreBouton, aSelection) {
          if (aGenreBouton === 1) {
            let lElementSelectionne =
              lListeModelesPourObjetListe.get(aSelection);
            if (!!lElementSelectionne) {
              if (!!lElementSelectionne.pere) {
                lElementSelectionne = lElementSelectionne.pere;
              }
              aParam.evntClbck({ modele: lElementSelectionne });
            }
          }
        }.bind(this),
        options: {
          estCasSondage: aParam && aParam.estCasSondage,
          filtres: { listeBruteCategories: aParam.listeCategories },
        },
      },
    );
    lFenetreListeModeles.setDonnees(
      new DonneesListeSondagesBiblio(lListeModelesPourObjetListe),
    );
  } else {
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Information,
      message:
        aParam && aParam.estCasSondage
          ? GTraductions.getValeur("actualites.modeles.AucunSondageDisponible")
          : GTraductions.getValeur("actualites.modeles.AucuneInfoDisponible"),
    });
  }
}
module.exports = { ObjetMoteurActus };
