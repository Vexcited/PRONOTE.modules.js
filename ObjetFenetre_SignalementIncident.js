const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetRequeteSaisieIncidents,
} = require("ObjetRequeteSaisieIncidents.js");
const { ObjetRequeteSaisieMotifs } = require("ObjetRequeteSaisieMotifs.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_SignalementIncident extends ObjetFenetre_Liste {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
    this.identDate = this.add(
      ObjetCelluleDate,
      _evntSurDate.bind(this),
      _initDate.bind(this),
    );
  }
  setDonnees(aParam) {
    this.incident = aParam.incident;
    this.incidents = aParam.incidents;
    this.motifs = aParam.motifs;
    this.listePJ = aParam.listePJ;
    this.afficher();
    this.avecValidation = aParam.avecValidation;
    this.setBoutonActif(1, false);
    this.getInstance(this.identListe).setDonnees(aParam.objetDonneesListe);
    this.getInstance(this.identDate).setDonnees(this.incident.dateheure);
  }
  composeContenu() {
    const T = [];
    const lIdInputHeure = GUID.getId();
    T.push(
      `<div class="flex-contain cols full-size">\n              <div class="flex-contain flex-center p-y-l flex-gap">`,
    );
    T.push(
      `<label>${GTraductions.getValeur("incidents.date")}</label><div class="m-right-l" id="${this.getNomInstance(this.identDate)}"></div>`,
    );
    T.push(
      `<label for="${lIdInputHeure}">${GTraductions.getValeur("incidents.heure")}</label><input id="${lIdInputHeure}" type="time" ie-model="heure" class="round-style" />`,
    );
    T.push(` </div>`);
    T.push(
      ` <div class="flex-contain fluid-bloc m-top">\n                <div class="full-size" id="${this.getNomInstance(this.identListe)}"></div>\n             </div>`,
    );
    T.push(`</div>`);
    return T.join("");
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      heure: {
        getValue: function () {
          return this.instance.incident
            ? GDate.formatDate(this.instance.incident.dateheure, "%hh:%mm")
            : "";
        },
        setValue: function (aValue, aParamsSetter) {
          const lDate = new Date(
            this.instance.incident.dateheure.getFullYear(),
            this.instance.incident.dateheure.getMonth(),
            this.instance.incident.dateheure.getDate(),
            aParamsSetter.time.heure,
            aParamsSetter.time.minute,
          );
          this.instance.incident.dateheure = lDate;
        },
        getDisabled: function () {
          return !this.instance.incident || !this.instance.incident.estEditable;
        },
      },
    });
  }
  surValidation(aGenreBouton) {
    if (aGenreBouton === 1) {
      if (this.motifs.existeElementPourValidation()) {
        const lListeActif = this.motifs.getListeElements((aElement) => {
          return aElement.cmsActif;
        });
        requeteSaisieMotifs.call(this, lListeActif, this.motifs, aGenreBouton);
      } else {
        _validationAuto.bind(this)(aGenreBouton);
      }
    } else {
      _finSurValidation.bind(this)(aGenreBouton);
    }
  }
}
function _evntSurDate(aDate) {
  const lDate = new Date(
    aDate.getFullYear(),
    aDate.getMonth(),
    aDate.getDate(),
    this.incident.dateheure.getHours(),
    this.incident.dateheure.getMinutes(),
  );
  this.incident.dateheure = lDate;
}
function _initDate(aInstance) {
  aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
  aInstance.setControleNavigation(true);
}
function requeteSaisieMotifs(aListeDonnees, aListeTot, aGenreBouton) {
  new ObjetRequeteSaisieMotifs(
    this,
    _apresRequeteSaisieMotifs.bind(this, aGenreBouton),
  ).lancerRequete({
    motifs: aListeTot,
    selection: aListeDonnees,
    avecAucunMotif: false,
  });
}
function _apresRequeteSaisieMotifs(aGenreBouton, aListeDonnees, aListeTot) {
  if (aListeTot) {
    this.motifs = aListeTot;
  }
  const lArrNew = aListeDonnees.getTableauNumeros();
  this.motifs.parcourir((aElement) => {
    if (lArrNew.includes(aElement.getNumero())) {
      aElement.cmsActif = true;
    }
  });
  _validationAuto.bind(this)(aGenreBouton);
}
function _validationAuto(aGenreBouton) {
  if (this.incident) {
    const lListeActif = this.motifs.getListeElements((aElement) => {
      return aElement.cmsActif;
    });
    const lAvecMotifFaitDeViolence =
      lListeActif.getIndiceElementParFiltre((aElement) => {
        return aElement.estFaitDeViolence;
      }) > -1;
    this.incident.faitDeViolence = lAvecMotifFaitDeViolence;
    this.incident.listeMotifs = lListeActif;
    this.incident.setEtat(EGenreEtat.Creation);
    this.incidents.addElement(this.incident);
    this.setEtatSaisie(true);
    const lObjetSaisie = { incidents: this.incidents };
    new ObjetRequeteSaisieIncidents(
      this,
      _reponseSaisie.bind(this, aGenreBouton),
    )
      .addUpload({ listeFichiers: this.listePJ })
      .lancerRequete(lObjetSaisie);
  }
}
function _reponseSaisie(aGenreBouton, aJSON) {
  this.setEtatSaisie(false);
  _finSurValidation.bind(this)(aGenreBouton, aJSON);
}
function _finSurValidation(aGenreBouton, aJSON) {
  if (aJSON && aJSON.incident) {
    GEtatUtilisateur.setNrIncidentSelectionne(aJSON.incident.getNumero());
  }
  const lMaSelection = this.getInstance(this.identListe).getSelection();
  this.fermer();
  if (this.optionsFenetre.callback) {
    this.optionsFenetre.callback(
      aGenreBouton,
      lMaSelection,
      this.changementListe,
      aJSON,
    );
  }
  this.callback.appel(aGenreBouton, lMaSelection, this.changementListe, aJSON);
}
module.exports = { ObjetFenetre_SignalementIncident };
