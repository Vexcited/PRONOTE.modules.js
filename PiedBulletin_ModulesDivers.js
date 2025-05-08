const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { Identite } = require("ObjetIdentite.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const { GDate } = require("ObjetDate.js");
class PiedBulletin_VieScolaire extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = { modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return true;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(this.Nom, this._construireAbsences(this.params.absences));
        break;
    }
  }
  _construireAbsences(aParam) {
    const T = [];
    for (const lAbs in aParam) {
      if (aParam[lAbs]) {
        T.push(aParam[lAbs]);
      }
    }
    const H = [];
    if (T.length > 0) {
      H.push(
        '<div class="PetitEspaceHaut PetitEspaceBas Gras" style="',
        GStyle.composeCouleurTexte(GCouleur.themeCouleur.foncee),
        '">',
        GTraductions.getValeur("PiedDeBulletin.VieScolaire"),
        "</div>",
      );
      H.push(T.join(" - "));
    }
    return H.join("");
  }
  getListeArborescente(aParam) {
    for (const lAbs in this.params.absences) {
      if (this.params.absences[lAbs]) {
        aParam.listeArb.ajouterUneFeuilleAuNoeud(
          aParam.racine,
          "",
          this.params.absences[lAbs],
        );
      }
    }
  }
}
class PiedBulletin_Stages extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = { modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return this.params.listeStages && this.params.listeStages.count();
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(
          this.Nom,
          this._construireStages(this.params.listeStages),
        );
        break;
    }
  }
  _construireStages(aListeStages) {
    const T = [];
    if (!!aListeStages) {
      T.push('<div class="Espace">');
      aListeStages.parcourir((aStage) => {
        T.push('<div class="EspaceBas">');
        if (!!aStage.session) {
          T.push("<div>", aStage.session, "</div>");
        }
        const lLibelleStage = [aStage.getLibelle()];
        if (!!aStage.dateInterruption) {
          lLibelleStage.push(
            " - ",
            GTraductions.getValeur("stage.InterrompuLe"),
            " ",
            GDate.formatDate(aStage.dateInterruption, "%JJ/%MM/%AAAA"),
          );
        }
        T.push("<div>", lLibelleStage.join(""), "</div>");
        if (!!aStage.listeMaitresDeStage) {
          aStage.listeMaitresDeStage.parcourir((D) => {
            T.push(
              '<div class="EspaceGauche">',
              "<span>",
              D.getLibelle(),
              "  : ",
              "</span>",
              '<span class="Gras">',
              D.appreciation || "",
              "</span>",
              "</div>",
            );
          });
        }
        if (!!aStage.listeProfesseurs) {
          aStage.listeProfesseurs.parcourir((D) => {
            T.push(
              '<div class="EspaceGauche">',
              "<span>",
              D.getLibelle(),
              "  : ",
              "</span>",
              '<span class="Gras">',
              D.appreciation || "",
              "</span>",
              "</div>",
            );
          });
        }
        T.push("</div>");
      });
      T.push("</div>");
    }
    return T.join("");
  }
  getListeArborescente() {}
}
class PiedBulletin_Mentions extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = { modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return (
      this.params.listeMentionsClasse && this.params.listeMentionsClasse.count()
    );
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(
          this.Nom,
          this._construireMentions(this.params.listeMentionsClasse),
        );
        break;
    }
  }
  setParametres(aParam) {
    $.extend(true, this.params, aParam);
  }
  _construireMentions(aParam) {
    const T = [];
    if (aParam && aParam.count()) {
      const lClass =
        this.params.modeAffichage === TypeModeAffichagePiedBulletin.MAPB_Onglets
          ? "Espace"
          : "";
      T.push('<div class="', lClass, '" >');
      T.push(
        '<div style="display: inline;">' +
          GTraductions.getValeur("PiedDeConseilDeClasse.Mentions") +
          "&nbsp;:&nbsp;" +
          "</div>",
      );
      const H = [];
      for (let i = 0, lNbr = aParam.count(); i < lNbr; i++) {
        const lElt = aParam.get(i);
        H.push(lElt.Nombre + "&nbsp;" + lElt.getLibelle());
      }
      T.push(
        '<div style="display: inline;" class="Gras">',
        H.join(" - "),
        "</div>",
      );
      T.push("</div>");
    }
    return T.join("");
  }
  getListeArborescente(aParam) {
    const lListe = this.params.listeMentionsClasse;
    if (lListe.count()) {
      const lNoeudMentions = aParam.listeArb.ajouterUnNoeudAuNoeud(
        aParam.racine,
        "",
        GTraductions.getValeur("PiedDeConseilDeClasse.Mentions"),
        null,
        false,
      );
      lListe.setTri([ObjetTri.init("Genre")]);
      lListe.trier();
      for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
        const lElt = lListe.get(i);
        if (lElt) {
          const lLibelle = lElt.getLibelle() + " : " + lElt.Nombre[0];
          aParam.listeArb.ajouterUneFeuilleAuNoeud(
            lNoeudMentions,
            "",
            lLibelle,
          );
        }
      }
    }
  }
}
class PiedBulletin_Legende extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Lineaire,
    };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return this.params.legende && this.params.legende.length > 0;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(this.Nom, this._construireLegende(this.params.legende));
        break;
    }
  }
  _construireLegende(aParam) {
    const T = [];
    if (aParam) {
      T.push('<div class="Italique">');
      T.push(aParam);
      T.push("</div>");
    }
    return T.join("");
  }
  getListeArborescente() {}
}
class PiedBulletin_Projets extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Lineaire,
    };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return true;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(
          this.Nom,
          this._construireProjets(this.params.listeProjets),
        );
        break;
    }
  }
  _construireProjets(aParam) {
    if (aParam) {
      if (aParam.count()) {
        return GTraductions.getValeur("BulletinEtReleve.Projets.Detail", [
          aParam.getTableauLibelles().join(", "),
        ]);
      } else {
        return GTraductions.getValeur("BulletinEtReleve.Projets.Aucun");
      }
    }
    return "";
  }
}
class PiedBulletin_Credits extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Lineaire,
    };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return this.params && this.params.listeCredits;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        GHtml.setHtml(
          this.Nom,
          this._construireCredits(this.params.listeCredits),
        );
        break;
    }
  }
  _construireCredits(aListeCredits) {
    const H = [];
    const titres = [];
    const donnees = [];
    for (let i = 0; i < aListeCredits.count(); i++) {
      const elt = aListeCredits.get(i);
      titres.push('<td style="width:100px;">', elt.getLibelle(), "</td>");
      donnees.push(
        '<td style="border:solid 1px',
        GCouleur.bordure,
        ';">',
        elt.credits,
        "</td>",
      );
    }
    H.push('<table style="border-collapse:collapse;">');
    H.push(
      '<tr style="text-align:center;border:solid 1px',
      GCouleur.bordure,
      ";",
      GStyle.composeCouleurFond(GCouleur.grisClair),
      '">',
    );
    H.push('<td style="width:100px;">&nbsp;</td>');
    H.push(titres.join(""));
    H.push("</tr>");
    H.push(
      '<tr style="text-align:center;border:solid 1px',
      GCouleur.bordure,
      ';">',
    );
    H.push(
      '<td style="border:solid 1px',
      GCouleur.bordure,
      ';">',
      GTraductions.getValeur("PiedDeBulletin.Credits"),
      "</td>",
    );
    H.push(donnees.join(""));
    H.push("</tr>");
    H.push("</table>");
    return H.join("");
  }
  getListeArborescente() {}
}
class PiedBulletin_Engagements extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Lineaire,
    };
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    return this.params && this.params.listeEngagements;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    GHtml.setHtml(
      this.Nom,
      this._construireEngagements(
        this.params.listeEngagements,
        aParam.modeAffichage,
      ),
    );
  }
  _construireEngagements(aListeEngagements, aModeAffichage) {
    const H = [];
    let lLibelle = GTraductions.getValeur("PiedDeBulletin.AucunEngagement");
    if (aListeEngagements.count()) {
      lLibelle = aListeEngagements.getTableauLibelles().join(", ");
    }
    switch (aModeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
        H.push(`<p class="m-all">${lLibelle}</p>`);
        break;
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        H.push(
          `<p class="m-top"><span class="ie-titre-petit theme_color_foncee Gras"> ${GTraductions.getValeur("PiedDeBulletin.Engagements")} :</span><br> ${lLibelle}</p>`,
        );
        break;
    }
    return H.join("");
  }
  getListeArborescente() {}
}
module.exports = {
  PiedBulletin_VieScolaire,
  PiedBulletin_Stages,
  PiedBulletin_Mentions,
  PiedBulletin_Legende,
  PiedBulletin_Projets,
  PiedBulletin_Credits,
  PiedBulletin_Engagements,
};
