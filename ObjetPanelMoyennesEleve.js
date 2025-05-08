const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GUID } = require("GUID.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { GDate } = require("ObjetDate.js");
class ObjetPanelMoyennesEleve extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteurNotes = new MoteurNotes();
    this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
    this.ids = {
      panel: GUID.getId(),
      bonus: GUID.getId(),
      moyennes: GUID.getId(),
    };
    this.dimensions = {
      largeurBonus: 75,
      largeurMoyenne: 100,
      fontSizeTitres: 17,
      hauteurTitres: 60,
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      nodeFlecheRetour: {
        event: function () {
          aInstance.callback.appel({
            genreEvnt: ObjetPanelMoyennesEleve.genreEvnt.valider,
            validationAuto: false,
          });
          GInterface.closePanel();
        },
      },
      surClickElevePrecedent: function (aNumero) {
        _getProchainElement.call(aInstance, aNumero, false);
      },
      surClickEleveSuivant: function (aNumeroEleve) {
        _getProchainElement.call(aInstance, aNumeroEleve, true);
      },
    });
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    this.afficher();
  }
  afficher() {
    GInterface.openPanel(_composeDetailMoyennesEleve.call(this), {
      controleur: this.controleur,
      optionsFenetre: {
        titre: GTraductions.getValeur("Notes.MoyenneEleve"),
        avecNavigation: this.donnees && this.donnees.eleve,
        titreNavigation: () => {
          return (
            this.donnees.eleve.getLibelle() +
            (!!this.donnees.eleve.niveau && this.donnees.eleve.niveau !== ""
              ? `<div class="niveau">${this.donnees.eleve.niveau.getLibelle()}</div>`
              : "")
          );
        },
        callbackNavigation: (aSuivant) => {
          _getProchainElement.call(
            this,
            this.donnees.eleve.getNumero(),
            aSuivant,
          );
        },
      },
    });
  }
}
ObjetPanelMoyennesEleve.genreEvnt = {
  valider: "valider",
  majMoyennes: "majMoyennes",
};
function _composeDetailMoyennesEleve() {
  if (this.donnees === null || this.donnees === undefined) {
    return "";
  }
  const H = [];
  H.push('<div class="ObjetPanelMoyennesEleve p-top-xxl">');
  H.push(
    '<h4 class="ie-sous-titre">',
    GTraductions.getValeur("Moyennes"),
    "</h4>",
  );
  H.push(
    '<div class="flex-contain p-x-xl p-y-l cols cols moyennes" id="',
    this.ids.moyennes,
    '">',
    _composeMoyennes.call(this),
    "</div>",
  );
  H.push(
    '<h4 class="ie-sous-titre">',
    GTraductions.getValeur("Notes.Devoirs"),
    "</h4>",
  );
  H.push(
    '<div class="flex-contain p-x-xl p-y-l cols devoirs">',
    _composeDevoirs.call(this),
    "</div>",
  );
  H.push("</div>");
  return H.join("");
}
function _composeLigneMoyenne(aParams) {
  const H = [];
  const lMoyenne = aParams.moyenne;
  let lStrNote =
    lMoyenne && !lMoyenne.estUneNoteVide() ? lMoyenne.getNote() : "";
  const lClass = ["ligne"];
  if (aParams.avecSeparateur) {
    lClass.push("separateur-top");
  }
  H.push(
    `<section class="${lClass.join(" ")}">`,
    `<article>`,
    `<p>${aParams.titre}</p>`,
    `</article>`,
    `<article>`,
    `<p>${lStrNote}</p>`,
    `</article>`,
    `</section>`,
  );
  return H.join("");
}
function _composeLigneDevoir(aParams) {
  const lNote = this.moteurNotes.getNoteEleveAuDevoirParNumero({
    listeDevoirs: this.donnees.listeDevoirs,
    numeroDevoir: aParams.devoir.getNumero(),
    numeroEleve: this.donnees.eleve.getNumero(),
  });
  const lAvecSsServices = this.donnees.avecSsServices;
  const lCoef = aParams.devoir.coefficient;
  const lAvecCoeff = lCoef && !lCoef.estCoefficientParDefaut();
  const lBareme = aParams.devoir.bareme;
  const lBaremeParDefaut = this.donnees.baremeParDefaut;
  const lAvecBareme =
    lBareme && lBareme.getValeur() !== lBaremeParDefaut.getValeur();
  const lClass = ["ligne"];
  if (!aParams.estDernierElement) {
    lClass.push("separateur-bottom");
  }
  let lStrNote = "";
  if (lNote && !lNote.estUneNoteVide()) {
    lStrNote = lNote.getNote();
    if (lAvecBareme) {
      lStrNote += `<span class="bareme">${lBareme.getBaremeEntier()}</span>`;
    }
  }
  const H = [];
  H.push(
    `<section class="${lClass.join(" ")}">`,
    `<article class="ctn-gauche">`,
    `<div class="date-contain">${GDate.formatDate(aParams.devoir.date, "%J %MMM")}</div>`,
    `</article>`,
    `<article class="ctn-centre">`,
    lAvecSsServices
      ? `<p>${aParams.devoir.service.matiere.getLibelle()}</p>`
      : "",
    lAvecCoeff
      ? `<div class="ie-sous-titre">${GTraductions.getValeur("Notes.Coefficient")} ${lCoef.getCoefficientEntier()}</div>`
      : "",
    `</article>`,
    `<article class="ctn-droite">`,
    `<p>${lStrNote}</p>`,
    `</article>`,
    `</section>`,
  );
  return H.join("");
}
function _composeDevoirs() {
  const H = [];
  this.donnees.listeDevoirs.parcourir((aDevoir, aIndex) => {
    H.push(
      _composeLigneDevoir.call(this, {
        estDernierElement: this.donnees.listeDevoirs.count() - 1 === aIndex,
        devoir: aDevoir,
      }),
    );
  });
  return H.join("");
}
function _composeMoyennes() {
  const H = [];
  const lEleve = this.donnees.eleve;
  H.push(
    _composeLigneMoyenne.call(this, {
      titre: this.donnees.service.matiere.getLibelle(),
      moyenne: lEleve.moyennes[MoteurNotesCP.genreMoyenne.Moyenne],
    }),
  );
  if (this.donnees.avecSsServices) {
    const lService = this.donnees.service;
    lService.listeServices.parcourir((aService, aIndex) => {
      H.push(
        _composeLigneMoyenne.call(this, {
          avecSeparateur: true,
          titre: aService.matiere.getLibelle(),
          moyenne:
            lEleve.moyennes[
              MoteurNotesCP.genreMoyenne.MoyenneSousService - aIndex
            ],
        }),
      );
    });
  }
  return H.join("");
}
function _getProchainElement(aNumeroElement, aEstSuivant) {
  const lListeEleves = this.donnees.listeEleves;
  let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
  lIndiceElementActuel = lListeEleves.getIndiceParNumeroEtGenre(aNumeroElement);
  if (!!aEstSuivant) {
    lIndiceProchainElement =
      lIndiceElementActuel + 1 < lListeEleves.count()
        ? lIndiceElementActuel + 1
        : 0;
  } else {
    lIndiceProchainElement =
      lIndiceElementActuel === 0
        ? lListeEleves.count() - 1
        : lIndiceElementActuel - 1;
  }
  lProchainElement = lListeEleves.get(lIndiceProchainElement);
  this.setDonnees($.extend({}, this.donnees, { eleve: lProchainElement }));
}
module.exports = { ObjetPanelMoyennesEleve };
