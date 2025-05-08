const { GUID } = require("GUID.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetRequeteSaisieIncidentsVuParAdmin = require("ObjetRequeteSaisieIncidentsVuParAdmin.js");
const {
  TypeGenreStatutProtagonisteIncident,
} = require("TypeGenreStatutProtagonisteIncident.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class ObjetIncidents extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    const lId = GUID.getId();
    this.idIncidents = lId + "_Incidents";
    this.idcbVu = lId + "_cbVu_";
    this.uniquementNonRA = true;
  }
  construireAffichage() {
    const H = [];
    if (!!this.donnees && !!this.donnees.listeIncidents) {
      H.push(
        '<div class="Espace AlignementDroit">',
        '<label class="Gras AlignementMilieuVertical">',
        GTraductions.getValeur("incidents.uniquNonRA"),
        "</label>",
        '<ie-switch class="InlineBlock AlignementMilieuVertical" ie-model="switchFiltreNonRA">',
        "</ie-switch>",
        "</div>",
      );
      H.push('<div id="', this.idIncidents, '">');
      H.push(this.composeIncidents(this.uniquementNonRA));
      H.push("</div>");
    }
    return H.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      switchFiltreNonRA: {
        getValue: function () {
          return !!aInstance.uniquementNonRA;
        },
        setValue: function (aValue) {
          aInstance.uniquementNonRA = aValue;
          GHtml.setHtml(
            aInstance.idIncidents,
            aInstance.composeIncidents(aValue),
          );
        },
      },
    });
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    this.afficher();
  }
  getStrProtagonistes(aElt, aGenre) {
    const lListeProtagonistes = aElt.protagonistes.getListeElements(
      (aElement) => {
        return aElement.Genre === aGenre;
      },
    );
    const lListeElts = new ObjetListeElements();
    lListeProtagonistes.parcourir((aAuteur) => {
      lListeElts.addElement(aAuteur.protagoniste);
    });
    if (lListeElts.count() > 0) {
      return lListeElts.getTableauLibelles().join(", ");
    } else {
      return "";
    }
  }
  composeIncidents(aUniquementNonRA) {
    const H = [];
    let lElt;
    const lListe = this.donnees.listeIncidents.getListeElements((aElement) => {
      return !aUniquementNonRA || !aElement.estRA;
    });
    if (lListe.count() === 0) {
      H.push(
        this.composeAucuneDonnee(
          GTraductions.getValeur("AbsenceVS.aucunIncident"),
        ),
      );
    } else {
      H.push('<ul class="collapsible">');
      for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
        lElt = lListe.get(i);
        H.push(this.composeIncident(lElt));
      }
      H.push("</ul>");
    }
    return H.join("");
  }
  composeIncident(aElt) {
    const H = [];
    let lStr;
    H.push("<li>");
    H.push(
      '<div class="collapsible-header active">',
      GChaine.format(GTraductions.getValeur("incidents.titreDuA"), [
        GDate.formatDate(aElt.dateheure, "%JJ/%MM/%AAAA"),
        GDate.formatDate(aElt.dateheure, "%hh:%mm"),
      ]),
      "</div>",
    );
    const lClassBody = "Espace";
    H.push('<div class="collapsible-body">');
    H.push(
      '<div class="',
      lClassBody,
      '">',
      GChaine.format(GTraductions.getValeur("incidents.signalePar"), [
        aElt.rapporteur.getLibelle(),
      ]),
      "</div>",
    );
    H.push(
      '<div class="',
      lClassBody,
      '">',
      GTraductions.getValeur("fiche.incident.motifs"),
      " : ",
      aElt.listeMotifs.getTableauLibelles().join(", "),
      "</div>",
    );
    H.push(
      '<div class="',
      lClassBody,
      '">',
      GTraductions.getValeur("fiche.incident.gravite"),
      " : ",
      aElt.gravite,
      "</div>",
    );
    lStr = this.getStrProtagonistes(
      aElt,
      TypeGenreStatutProtagonisteIncident.GSP_Auteur,
    );
    if (lStr !== "") {
      H.push(
        '<div class="',
        lClassBody,
        '">',
        GTraductions.getValeur("fiche.incident.auteur"),
        " : ",
        lStr,
        "</div>",
      );
    }
    lStr = this.getStrProtagonistes(
      aElt,
      TypeGenreStatutProtagonisteIncident.GSP_Victime,
    );
    if (lStr !== "") {
      H.push(
        '<div class="',
        lClassBody,
        '">',
        GTraductions.getValeur("fiche.incident.victime"),
        " : ",
        lStr,
        "</div>",
      );
    }
    lStr = this.getStrProtagonistes(
      aElt,
      TypeGenreStatutProtagonisteIncident.GSP_Temoin,
    );
    if (lStr !== "") {
      H.push(
        '<div class="',
        lClassBody,
        '">',
        GTraductions.getValeur("fiche.incident.temoin"),
        " : ",
        lStr,
        "</div>",
      );
    }
    H.push('<div class="', lClassBody, '">', aElt.getLibelle(), "</div>");
    const lNb = aElt.documents ? aElt.documents.count() : 0;
    if (lNb > 0) {
      H.push('<div class="', lClassBody, '">');
      for (let i = 0; i < lNb; i++) {
        const lDocJoint = aElt.documents.get(i);
        H.push(
          GChaine.composerUrlLienExterne({
            documentJoint: lDocJoint,
            genreRessource: EGenreRessource.RelationIncidentFichierExterne,
          }) + "<br />",
        );
      }
      H.push("</div>");
    }
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Administrateur) {
      H.push(
        '<div class="Espace">',
        "<label>",
        '<input id="' +
          this.idcbVu +
          aElt.getNumero() +
          '" onclick="' +
          this.Nom +
          ".evntVu('",
        aElt.getNumero(),
        '\');" type="checkbox" ' +
          (!!aElt.estVise ? 'checked="cheked"' : "") +
          " >",
        "<span>",
        GTraductions.getValeur("fiche.incident.labelCocheVise"),
        "</span>",
        "</label>",
        "</div>",
      );
    }
    H.push("</div>");
    H.push("</li>");
    return H.join("");
  }
  evntVu(aNumeroIncident) {
    const lElt =
      this.donnees.listeIncidents.getElementParNumero(aNumeroIncident);
    lElt.estVise = !lElt.estVise;
    lElt.setEtat(EGenreEtat.Modification);
    new ObjetRequeteSaisieIncidentsVuParAdmin(this).lancerRequete({
      incidents: this.donnees.listeIncidents,
    });
  }
}
module.exports = ObjetIncidents;
