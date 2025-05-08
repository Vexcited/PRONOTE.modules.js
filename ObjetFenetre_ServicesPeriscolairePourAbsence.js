const { ObjetFenetre } = require("ObjetFenetre.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { GDate } = require("ObjetDate.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_ServicesPeriscolairePourAbsence extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({ avecTailleSelonContenu: true });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getDatesAbsence: function () {
        if (aInstance && aInstance.donnees && aInstance.donnees.absence) {
          const lResult = [];
          if (
            GDate.getNbrJoursEntreDeuxDates(
              aInstance.donnees.absence.debut.date,
              aInstance.donnees.absence.fin.date,
            ) >= 1
          ) {
            lResult.push(
              GDate.formatDate(
                aInstance.donnees.absence.debut.date,
                `${GTraductions.getValeur("Du")} %JJJ %JJ/%MM/%AAAA ${aInstance.donnees.absence.debut.estMatin ? GTraductions.getValeur("AbsenceVS.matin") : GTraductions.getValeur("AbsenceVS.apresMidi")}`,
              ),
            );
            lResult.push(
              GDate.formatDate(
                aInstance.donnees.absence.fin.date,
                `${GTraductions.getValeur("Au")} %JJJ %JJ/%MM/%AAAA ${aInstance.donnees.absence.fin.estMatin ? GTraductions.getValeur("AbsenceVS.matin") : GTraductions.getValeur("AbsenceVS.apresMidi")}`,
              ),
            );
          } else {
            let lSuff = "";
            if (
              aInstance.donnees.absence.debut.estMatin ===
              aInstance.donnees.absence.fin.estMatin
            ) {
              lSuff = aInstance.donnees.absence.debut.estMatin
                ? GTraductions.getValeur("AbsenceVS.matin")
                : GTraductions.getValeur("AbsenceVS.apresMidi");
            }
            lResult.push(
              GDate.formatDate(
                aInstance.donnees.absence.debut.date,
                `[${GTraductions.getValeur("Le")} %JJJ %JJ/%MM/%AAAA] ${lSuff}`,
              ),
            );
          }
          return lResult.join(" ") + ". ";
        }
        return "";
      },
      getListeServices: function () {
        if (aInstance && aInstance.donnees && aInstance.donnees.liste) {
          const lResult = [];
          aInstance.donnees.liste.parcourir((aElement) => {
            lResult.push(
              tag(
                "ie-checkbox",
                {
                  class: ["fsp_cb_service"],
                  "ie-model": tag.funcAttr("checkService", [
                    aElement.getNumero(),
                  ]),
                },
                aElement.getLibelle(),
              ),
            );
          });
          return lResult.join("");
        }
        return "";
      },
      checkService: {
        getValue: function (aNumero) {
          const lService = aInstance.donnees.liste.getElementParNumero(aNumero);
          if (!!lService) {
            return !lService.estPartiel;
          }
          return false;
        },
        setValue: function (aNumero, aValue) {
          const lService = aInstance.donnees.liste.getElementParNumero(aNumero);
          if (!!lService) {
            lService.estPartiel = !aValue;
          }
        },
      },
    });
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    if (this.donnees.liste) {
      this.donnees.liste.setTri(
        ObjetTri.initRecursif("pere", [
          ObjetTri.init("heureOuverture"),
          ObjetTri.init("heureFermeture"),
          ObjetTri.init("Libelle"),
        ]),
      );
      this.donnees.liste.trier();
    }
    this.afficher();
  }
  composeContenu() {
    const lHtml = [];
    lHtml.push('<span class="fsp_absence">');
    lHtml.push(
      tag(
        "span",
        { class: ["fsp_absence_info"] },
        `${GTraductions.getValeur("fenetreServicesPeriscolairePourAbsence.info")} `,
      ),
    );
    lHtml.push(
      tag("span", {
        "ie-html": "getDatesAbsence",
        class: ["fsp_absence_date"],
      }),
    );
    lHtml.push(
      tag(
        "span",
        { class: ["fsp_absence_suppl"] },
        GTraductions.getValeur("fenetreServicesPeriscolairePourAbsence.suppl"),
      ),
    );
    lHtml.push(
      tag("span", {
        "ie-html": "getListeServices",
        class: ["fsp_liste_services"],
      }),
    );
    lHtml.push("</span>");
    return lHtml.join("");
  }
  getParametresValidation(aNumeroBouton) {
    const lParametres = super.getParametresValidation(aNumeroBouton);
    const lListe = this.donnees.liste.getListeElements((aElement) => {
      return !aElement.estPartiel;
    });
    $.extend(lParametres, { liste: lListe });
    return lParametres;
  }
  static ouvrir(aParams) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_ServicesPeriscolairePourAbsence,
      { pere: aParams.pere, evenement: aParams.evenement },
      {
        modale: true,
        titre: GTraductions.getValeur(
          "fenetreServicesPeriscolairePourAbsence.titre",
        ),
        listeBoutons: [
          {
            libelle: GTraductions.getValeur("Annuler"),
            theme: TypeThemeBouton.secondaire,
          },
          {
            libelle: GTraductions.getValeur("Valider"),
            valider: true,
            theme: TypeThemeBouton.primaire,
          },
        ],
        largeur: 540,
        avecTailleSelonContenu: true,
      },
    );
    lFenetre.setDonnees(aParams.donnees);
  }
}
module.exports = { ObjetFenetre_ServicesPeriscolairePourAbsence };
