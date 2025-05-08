const { PageSaisieAbsences } = require("PageSaisieAbsences.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GClass } = require("ObjetClass.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetGestionnaireMotifs } = require("ObjetGestionnaireMotifs.js");
const {
  EGenreEvenementSaisieAbsence,
} = require("Enumere_EvenementSaisieAbsences.js");
class ObjetAffichagePageSaisieAbsences_Journee extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.TexteRetard = "5'";
    this.TexteExclusion = GTraductions.getValeur("AbsenceVS.ExclusionAbr");
    this.TexteInfirmerie = GTraductions.getValeur("AbsenceVS.InfirmerieAbr");
    this.CouleurAbsence = "#fdce40";
    this.CouleurRetard = "#3333cc";
    this.CouleurExclusion = "var(--color-red)";
    this.CouleurInfirmerie = "#008000";
    this.options = {
      avecSaisiePunition: false,
      avecSaisieExclusion: false,
      avecSaisiePassageInfirmerie: false,
      avecSaisieRetard: false,
    };
    this.genreAbsenceActif = EGenreRessource.Absence;
  }
  construireInstances() {
    this.IdentAbsences = this.add(
      PageSaisieAbsences,
      this.evenementAbsences,
      this.initialiserAbsences,
    );
    if (this.options.avecSaisieExclusion) {
      this.identGestionnaireMotifs = this.add(
        ObjetGestionnaireMotifs,
        _surGestionnaireMotifs.bind(this),
      );
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      radioTypeAbsence: {
        getValue: function (aGenreAbsence) {
          return aInstance.genreAbsenceActif === aGenreAbsence;
        },
        setValue: function (aGenreAbsence) {
          aInstance.genreAbsenceActif = aGenreAbsence;
          aInstance
            .getInstance(aInstance.IdentAbsences)
            .setTypeAbsence(aGenreAbsence);
          switch (aGenreAbsence) {
            case EGenreRessource.Retard:
              GHtml.setFocus(aInstance.Nom + "_DureeRetard");
              break;
          }
        },
        getDisabled: function (aGenreAbsence) {
          return !_genreAbsenceAutoriseSurCoursCourant.call(
            aInstance,
            aGenreAbsence,
          );
        },
      },
      btnSaisiePunition: {
        event() {
          aInstance._evenementSurBoutonSaisiePunitions();
        },
        getDisabled() {
          let lEstActif = false;
          if (aInstance.getActif()) {
            const lEleveSelectionne = GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Eleve,
            );
            if (!!lEleveSelectionne) {
              lEstActif = true;
              if (
                !!lEleveSelectionne.estSorti ||
                !!lEleveSelectionne.sortiePeda ||
                !!lEleveSelectionne.estDetache
              ) {
                lEstActif = false;
              }
            }
          }
          return !lEstActif;
        },
      },
      btnListePunitions: {
        event() {
          aInstance._evenementSurBoutonListePunitions();
        },
        getDisabled() {
          let lEstActif = false;
          if (aInstance.getActif()) {
            lEstActif = true;
          }
          return !lEstActif;
        },
      },
      getHintBtnListePunitions() {
        return GTraductions.getValeur("Absence.HintBoutonVoirPunition");
      },
    });
  }
  setDonnees(aOptions) {
    $.extend(this.options, aOptions);
  }
  setDonneesBandeauAbsences(ADureeRetard, AListeMotifsExclusion) {
    GHtml.setDisplay(this.Nom + "_BandeauAbsences", true);
    if (MethodesObjet.isNumber(ADureeRetard)) {
      this.DureeRetard = ADureeRetard;
      GHtml.setValue(this.Nom + "_DureeRetard", "" + ADureeRetard);
    }
    this.listeMotifsExclusion = AListeMotifsExclusion;
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div class="m-all" style="height:60px;">' +
        this.composeBandeauAbsences() +
        "</div>",
    );
    H.push(
      '<div class="m-all" id="' +
        this.Instances[this.IdentAbsences].getNom() +
        '" style="position:relative;"></div>',
    );
    return H.join("");
  }
  composeBandeauAbsences() {
    const lHauteurContenu = 37;
    const lHtml = [];
    lHtml.push(
      '<table id="',
      this.Nom,
      '_BandeauAbsences" class="EspaceBas p-left-s" style="display:none;">',
      '<tr><td class="full-width">',
    );
    lHtml.push(
      '<fieldset class="',
      GClass.getZone(),
      '" style="margin:0 2px 2px 0; padding:0;">',
      '<legend class="',
      GClass.getLegende(),
      '">',
      GTraductions.getValeur("AbsenceVS.LegendeFeuilleAppel"),
      "</legend>",
      '<table style="' + GStyle.composeHeight(lHauteurContenu) + '">',
      "<tr>",
    );
    lHtml.push(
      '<td class="EspaceGauche">',
      "<table><tr>",
      "<td>",
      '<ie-radio ie-model="radioTypeAbsence(',
      EGenreRessource.Absence,
      ')">',
      GTraductions.getValeur("Absence.Absence"),
      "</ie-radio>",
      "</td>",
      '<td class="PetitEspaceGauche"><div style="width:15px; border:1px solid darkgray; background-color: ',
      this.CouleurAbsence,
      ';" class="Texte9">&nbsp;</div></td>',
      "</tr></table>",
      "</td>",
    );
    if (this.options.avecSaisieRetard) {
      lHtml.push(
        '<td class="GrandEspaceGauche">',
        "<table><tr>",
        "<td>",
        '<ie-radio ie-model="radioTypeAbsence(',
        EGenreRessource.Retard,
        ')">',
        GTraductions.getValeur("Absence.Retard"),
        "</ie-radio>",
        "</td>",
        '<td class="PetitEspaceGauche"><input type="text" size="3" maxlength="3" style="width:30px;" tabindex="-1" class="Texte10 CelluleTexte" id="',
        this.Nom,
        '_DureeRetard" onchange="',
        this.Nom,
        '.evenementSurDureeRetard (value)" onkeypress="',
        this.Nom,
        '.surKeyPressDureeRetard (event)" /></td>',
        '<td class="Texte10 Gras EspaceGauche">' +
          GTraductions.getValeur("Absence.minute") +
          "</td>",
        "</tr></table>",
        "</td>",
      );
    }
    if (this.options.avecSaisieExclusion) {
      lHtml.push(
        '<td class="GrandEspaceGauche">',
        "<table><tr>",
        "<td>",
        '<ie-radio ie-model="radioTypeAbsence(',
        EGenreRessource.Exclusion,
        ')">',
        GTraductions.getValeur("Absence.Exclusion"),
        "</ie-radio>",
        "</td>",
        '<td class="EspaceGauche Gras" style="color:',
        this.CouleurExclusion,
        '">',
        this.TexteExclusion,
        "</td>",
        "</tr></table>",
        "</td>",
      );
    }
    if (this.options.avecSaisiePassageInfirmerie) {
      lHtml.push(
        '<td class="GrandEspaceGauche EspaceDroit">',
        "<table><tr>",
        "<td>",
        '<ie-radio ie-model="radioTypeAbsence(',
        EGenreRessource.Infirmerie,
        ')">',
        GTraductions.getValeur("Absence.Infirmerie"),
        "</ie-radio>",
        "</td>",
        '<td class="EspaceGauche Gras" style="color:',
        this.CouleurInfirmerie,
        '; font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;">',
        this.TexteInfirmerie,
        "</td>",
        "</tr></table>",
        "</td>",
      );
    }
    lHtml.push("</tr>", "</table>", "</fieldset>", "</td>");
    if (this.options.avecSaisiePunition) {
      lHtml.push(
        '<td class="EspaceGauche">',
        '<fieldset class="',
        GClass.getZone(),
        '" style="margin:0px 2px 2px 2px; padding:0px;">',
        '<legend class="',
        GClass.getLegende(),
        '">',
        GTraductions.getValeur("Absence.TitrePunitions"),
        "</legend>",
        '<table style="' + GStyle.composeHeight(lHauteurContenu) + '"><tr>',
      );
      lHtml.push(
        '<td class="EspaceGauche"><div class="Image_IconePunition"></div></td>',
      );
      lHtml.push(
        '<td><ie-bouton ie-model="btnSaisiePunition">',
        GTraductions.getValeur("AbsenceVS.SaisirPunition"),
        "</ie-bouton></td>",
      );
      lHtml.push(
        '<td><ie-bouton ie-model="btnListePunitions" ie-title="getHintBtnListePunitions">',
        GTraductions.getValeur("AbsenceVS.Liste"),
        "</ie-bouton></td>",
      );
      lHtml.push("</tr></table>", "</fieldset>", "</td>");
    }
    lHtml.push("</tr>", "</table>");
    return lHtml.join("");
  }
  initialiserAbsences(aInstance) {
    aInstance.setCouleurs(
      this.CouleurAbsence,
      this.CouleurExclusion,
      this.CouleurRetard,
      this.CouleurInfirmerie,
    );
    aInstance.setParametres(
      GParametres.PlacesParJour,
      GParametres.PlacesParHeure,
      GParametres.LibellesHeures,
    );
  }
  evenementAbsences(aEvent, aObjet) {
    switch (aEvent) {
      case EGenreEvenementSaisieAbsence.CreerExclusion:
        if (!this.options.avecSaisieExclusion) {
          return;
        }
        this.objAbsence = aObjet;
        this.getInstance(this.identGestionnaireMotifs).ouvrirFenetre({
          avecSetDonnees: true,
        });
        break;
      case EGenreEvenementSaisieAbsence.SelectionEleve:
        if (this.options.avecSaisiePunition) {
          this.$refresh();
        }
        return this.callback.appel(arguments[0], arguments[1]);
      default:
        return this.callback.appel(arguments[0], arguments[1]);
    }
  }
  _evenementSurBoutonListePunitions() {
    if (!this.options.avecSaisiePunition) {
      return;
    }
    this.callback.appel(EGenreEvenementSaisieAbsence.PunitionListe);
  }
  _evenementSurBoutonSaisiePunitions() {
    if (!this.options.avecSaisiePunition) {
      return;
    }
    this.callback.appel(EGenreEvenementSaisieAbsence.PunitionSaisie);
  }
  evenementSurDureeRetard(AValeur) {
    const LDuree = parseInt(AValeur, 10);
    if (!isNaN(LDuree) && LDuree >= 1 && LDuree <= 999) {
      this.DureeRetard = LDuree;
    }
    GHtml.setValue(this.Nom + "_DureeRetard", this.DureeRetard);
    this.getInstance(this.IdentAbsences).setDonneesDureeRetard(
      this.DureeRetard,
    );
    this.callback.appel(EGenreEvenementSaisieAbsence.DureeRetard, {
      dureeRetard: this.DureeRetard,
    });
  }
  surKeyPressDureeRetard(aEvent) {
    GNavigateur.setCaractereTouche(aEvent);
    if (!GNavigateur.estCaractereDecimal()) {
      GNavigateur.bloquerValeurEvenement(aEvent);
    }
  }
  recupererDonnees() {}
  setActif(aEstActif) {
    super.setActif(aEstActif);
    GHtml.setDisplay(this.getInstance(this.IdentAbsences).getNom(), aEstActif);
  }
  setDeplacementBornes(aEstDeplace) {
    this.getInstance(this.IdentAbsences).setAvecDeplacementBornes(aEstDeplace);
  }
  afficher(aMessage) {
    GHtml.setDisplay(this.getInstance(this.IdentAbsences).getNom(), true);
    GHtml.setDisplay(this.Nom + "_BandeauAbsences", false);
    this.getInstance(this.IdentAbsences).afficher(aMessage);
  }
  setDonneesAbsences(aObjet) {
    this.coursSelectionne = aObjet ? aObjet.cours : null;
    if (
      !_genreAbsenceAutoriseSurCoursCourant.call(this, this.genreAbsenceActif)
    ) {
      this.genreAbsenceActif = EGenreRessource.Absence;
    }
    this.enAffichage = true;
    const lIdBandeau = this.Nom + "_BandeauAbsences";
    GHtml.setDisplay(lIdBandeau, false);
    if (aObjet) {
      aObjet.callbackAvecGrille = function () {
        GHtml.setDisplay(lIdBandeau, true);
      };
    }
    this.getInstance(this.IdentAbsences).setDonnees(aObjet);
  }
  setEnAffichage() {
    this.enAffichage = false;
    this.getInstance(this.IdentAbsences).DonneesRecues = false;
  }
  setPlacesSaisie(aDebut, aFin) {
    this.getInstance(this.IdentAbsences).setDonneesPlacesSaisie(aDebut, aFin);
  }
  retourAbsence(aNumeroEleve, aRessourceAbsence) {
    this.getInstance(this.IdentAbsences).evenementAbsence(
      aNumeroEleve,
      aRessourceAbsence,
    );
  }
  actualiserPunitionsEleve(aNumeroEleve) {
    this.getInstance(this.IdentAbsences).actualiserPunitionsEleve(aNumeroEleve);
  }
}
function _genreAbsenceAutoriseSurCoursCourant(aGenreAbsence) {
  if (this.coursSelectionne && this.coursSelectionne.estSortiePedagogique) {
    return (
      aGenreAbsence !== EGenreRessource.Infirmerie &&
      aGenreAbsence !== EGenreRessource.Exclusion
    );
  }
  return true;
}
function _surGestionnaireMotifs(aParam) {
  if (aParam.event === ObjetGestionnaireMotifs.genreEvent.actualiserDonnees) {
    if (aParam.genreBouton === 1) {
      this.objAbsence.listeMotifs = aParam.liste;
      this.callback.appel(
        EGenreEvenementSaisieAbsence.ActionSurAbsence,
        this.objAbsence,
      );
    } else {
      if (this.objAbsence && this.objAbsence.callbackAnnulation) {
        this.objAbsence.callbackAnnulation();
      }
    }
  }
}
module.exports = { ObjetAffichagePageSaisieAbsences_Journee };
