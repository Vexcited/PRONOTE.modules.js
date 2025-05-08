exports.ParamAffRecapAbsences = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetSelecteurMotifAbsence_1 = require("ObjetSelecteurMotifAbsence");
const ObjetSelecteurMotifInfirmerie_1 = require("ObjetSelecteurMotifInfirmerie");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetClass_1 = require("ObjetClass");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeChoixComptabilisation_1 = require("TypeChoixComptabilisation");
var GenreParametreRecapAbsences;
(function (GenreParametreRecapAbsences) {
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquNonRA"] = 1)
  ] = "cbUniquNonRA";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquInfAge"] = 2)
  ] = "cbUniquInfAge";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["editBorneAge"] = 3)
  ] = "editBorneAge";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbGpeAbsences"] = 4)
  ] = "cbGpeAbsences";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbGpeAbsRepas"] = 5)
  ] = "cbGpeAbsRepas";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbGpeAbsInternat"] = 6)
  ] = "cbGpeAbsInternat";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbGpeRetard"] = 7)
  ] = "cbGpeRetard";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbGpeInfirmerie"] = 8)
  ] = "cbGpeInfirmerie";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquAbsSup"] = 9)
  ] = "cbUniquAbsSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["editBorneDJAbsSup"] = 10)
  ] = "editBorneDJAbsSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquTotAbsSup"] = 11)
  ] = "cbUniquTotAbsSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["editBorneDJTotAbsSup"] = 12)
  ] = "editBorneDJTotAbsSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquAbsInjust"] = 13)
  ] = "cbUniquAbsInjust";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquRetardSup"] = 14)
  ] = "cbUniquRetardSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["editBorneRetardSup"] = 15)
  ] = "editBorneRetardSup";
  GenreParametreRecapAbsences[
    (GenreParametreRecapAbsences["cbUniquRetardInjust"] = 16)
  ] = "cbUniquRetardInjust";
})(GenreParametreRecapAbsences || (GenreParametreRecapAbsences = {}));
class ParamAffRecapAbsences extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.idDemi = GUID_1.GUID.getId();
    this.idDemiTot = GUID_1.GUID.getId();
    this.initDroits();
  }
  initDroits() {
    this.droits = {
      avecPunitions: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPunitions,
      ),
      avecChoixRepas: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesDemiPension,
      ),
      avecChoixInternat: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesInternat,
      ),
      avecChoixInfirmerie: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionInfirmerie,
      ),
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      cbParametreAff: {
        getValue(aGenre) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.cbUniquNonRA:
                return lSelection.uniquementNonRA;
              case GenreParametreRecapAbsences.cbUniquInfAge:
                return lSelection.uniquementPlusJeunesQue;
              case GenreParametreRecapAbsences.cbGpeAbsences:
                return lSelection.avecGpeAbsences;
              case GenreParametreRecapAbsences.cbUniquAbsSup:
                return lSelection.uniquementAbsSup;
              case GenreParametreRecapAbsences.cbUniquTotAbsSup:
                return lSelection.uniquementTotalAbsSup;
              case GenreParametreRecapAbsences.cbUniquAbsInjust:
                return lSelection.uniquementAbsInjustifie;
              case GenreParametreRecapAbsences.cbGpeAbsRepas:
                return lSelection.avecGpeAbsRepas;
              case GenreParametreRecapAbsences.cbGpeAbsInternat:
                return lSelection.avecGpeAbsInternat;
              case GenreParametreRecapAbsences.cbGpeRetard:
                return lSelection.avecGpeRetard;
              case GenreParametreRecapAbsences.cbUniquRetardSup:
                return lSelection.uniquementRetardSup;
              case GenreParametreRecapAbsences.cbUniquRetardInjust:
                return lSelection.uniquementRetardInjustifie;
              case GenreParametreRecapAbsences.cbGpeInfirmerie:
                return lSelection.avecGpeInfirmerie;
            }
          }
          return "";
        },
        setValue(aGenre, aValue) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.cbUniquNonRA:
                lSelection.uniquementNonRA = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquInfAge:
                lSelection.uniquementPlusJeunesQue = aValue;
                break;
              case GenreParametreRecapAbsences.cbGpeAbsences:
                lSelection.avecGpeAbsences = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquAbsSup:
                lSelection.uniquementAbsSup = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquTotAbsSup:
                lSelection.uniquementTotalAbsSup = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquAbsInjust:
                lSelection.uniquementAbsInjustifie = aValue;
                break;
              case GenreParametreRecapAbsences.cbGpeAbsRepas:
                lSelection.avecGpeAbsRepas = aValue;
                break;
              case GenreParametreRecapAbsences.cbGpeAbsInternat:
                lSelection.avecGpeAbsInternat = aValue;
                break;
              case GenreParametreRecapAbsences.cbGpeRetard:
                lSelection.avecGpeRetard = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquRetardSup:
                lSelection.uniquementRetardSup = aValue;
                break;
              case GenreParametreRecapAbsences.cbUniquRetardInjust:
                lSelection.uniquementRetardInjustifie = aValue;
                break;
              case GenreParametreRecapAbsences.cbGpeInfirmerie:
                lSelection.avecGpeInfirmerie = aValue;
                break;
            }
            switch (aGenre) {
              case GenreParametreRecapAbsences.cbUniquNonRA:
              case GenreParametreRecapAbsences.cbUniquInfAge:
              case GenreParametreRecapAbsences.cbUniquAbsSup:
              case GenreParametreRecapAbsences.cbUniquTotAbsSup:
              case GenreParametreRecapAbsences.cbUniquAbsInjust:
              case GenreParametreRecapAbsences.cbUniquRetardSup:
              case GenreParametreRecapAbsences.cbUniquRetardInjust:
                aInstance.actualiserDonnees({});
                break;
              case GenreParametreRecapAbsences.cbGpeAbsences:
              case GenreParametreRecapAbsences.cbGpeAbsRepas:
              case GenreParametreRecapAbsences.cbGpeAbsInternat:
              case GenreParametreRecapAbsences.cbGpeRetard:
              case GenreParametreRecapAbsences.cbGpeInfirmerie:
                aInstance.evntSurCBGpe(aGenre);
                aInstance.actualiserDonnees({ avecModifCBGpe: true });
                break;
            }
          }
        },
        getDisabled(aGenre) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.cbGpeAbsences:
              case GenreParametreRecapAbsences.cbGpeAbsRepas:
              case GenreParametreRecapAbsences.cbGpeAbsInternat:
              case GenreParametreRecapAbsences.cbGpeRetard:
              case GenreParametreRecapAbsences.cbGpeInfirmerie:
                return false;
              case GenreParametreRecapAbsences.cbUniquAbsSup:
                return (
                  !lSelection.avecGpeAbsences ||
                  lSelection.typeDecompteAbs ===
                    TypeChoixComptabilisation_1.TypeChoixComptabilisation
                      .HeuresDeCours
                );
              case GenreParametreRecapAbsences.cbUniquTotAbsSup:
                return (
                  !lSelection.avecGpeAbsences ||
                  lSelection.typeDecompteAbs ===
                    TypeChoixComptabilisation_1.TypeChoixComptabilisation
                      .HeuresDeCours
                );
              case GenreParametreRecapAbsences.cbUniquAbsInjust:
                return !lSelection.avecGpeAbsences;
              case GenreParametreRecapAbsences.cbUniquRetardSup:
                return !lSelection.avecGpeRetard;
              case GenreParametreRecapAbsences.cbUniquRetardInjust:
                return !lSelection.avecGpeRetard;
              case GenreParametreRecapAbsences.cbUniquNonRA:
                return false;
              case GenreParametreRecapAbsences.cbUniquInfAge:
                return false;
            }
          }
          return false;
        },
      },
      inputModelTexte: {
        getValue(aGenre) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.editBorneAge:
                return lSelection.borneAge || "";
              case GenreParametreRecapAbsences.editBorneDJAbsSup:
                return lSelection.nbDJ_absSup || 0;
              case GenreParametreRecapAbsences.editBorneDJTotAbsSup:
                return lSelection.nbDJ_totalAbsSup || 0;
              case GenreParametreRecapAbsences.editBorneRetardSup:
                return lSelection.borneDureeRetard || 0;
            }
          }
          return "";
        },
        setValue(aGenre, aValue) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.editBorneAge:
                lSelection.borneAge = ObjetChaine_1.GChaine.strToInteger(
                  aValue || "0",
                );
                break;
              case GenreParametreRecapAbsences.editBorneDJAbsSup:
                lSelection.nbDJ_absSup = ObjetChaine_1.GChaine.strToInteger(
                  aValue || "0",
                );
                break;
              case GenreParametreRecapAbsences.editBorneDJTotAbsSup:
                lSelection.nbDJ_totalAbsSup =
                  ObjetChaine_1.GChaine.strToInteger(aValue || "0");
                break;
              case GenreParametreRecapAbsences.editBorneRetardSup:
                lSelection.borneDureeRetard =
                  ObjetChaine_1.GChaine.strToInteger(aValue || "0");
                break;
            }
          }
        },
        getDisabled(aGenre) {
          const lSelection = aInstance.selection;
          if (lSelection) {
            switch (aGenre) {
              case GenreParametreRecapAbsences.editBorneDJAbsSup:
                return (
                  !lSelection.avecGpeAbsences ||
                  lSelection.typeDecompteAbs ===
                    TypeChoixComptabilisation_1.TypeChoixComptabilisation
                      .HeuresDeCours ||
                  !lSelection.uniquementAbsSup
                );
              case GenreParametreRecapAbsences.editBorneDJTotAbsSup:
                return (
                  !lSelection.avecGpeAbsences ||
                  lSelection.typeDecompteAbs ===
                    TypeChoixComptabilisation_1.TypeChoixComptabilisation
                      .HeuresDeCours ||
                  !lSelection.uniquementTotalAbsSup
                );
              case GenreParametreRecapAbsences.editBorneRetardSup:
                return (
                  !lSelection.avecGpeRetard || !lSelection.uniquementRetardSup
                );
              case GenreParametreRecapAbsences.editBorneAge:
                return !lSelection.uniquementPlusJeunesQue;
            }
          }
          return false;
        },
        exitChange(aGenre) {
          switch (aGenre) {
            case GenreParametreRecapAbsences.editBorneAge:
            case GenreParametreRecapAbsences.editBorneDJAbsSup:
            case GenreParametreRecapAbsences.editBorneDJTotAbsSup:
            case GenreParametreRecapAbsences.editBorneRetardSup:
              aInstance.actualiserDonnees({});
              break;
          }
        },
      },
    });
  }
  _evntSelecteurMotif(aParam) {
    switch (aParam.genreRessource) {
      case Enumere_Ressource_1.EGenreRessource.Absence:
        this.selection.motifsAbsences = aParam.listeSelection;
        break;
      case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
        this.selection.motifsAbsRepas = aParam.listeSelection;
        break;
      case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
        this.selection.motifsAbsInternat = aParam.listeSelection;
        break;
      case Enumere_Ressource_1.EGenreRessource.Retard:
        this.selection.motifsRetard = aParam.listeSelection;
        break;
      case Enumere_Ressource_1.EGenreRessource.Infirmerie:
        this.selection.issuesInfirmerie = aParam.listeSelection;
        break;
    }
    this.actualiserDonnees({});
  }
  construireInstances() {
    this.identSelecteurMotifsAbs = this.add(
      ObjetSelecteurMotifAbsence_1.ObjetSelecteurMotifAbsence,
      this._evntSelecteurMotif,
    );
    this.identSelecteurMotifsAbsRepas = this.add(
      ObjetSelecteurMotifAbsence_1.ObjetSelecteurMotifAbsence,
      this._evntSelecteurMotif,
    );
    this.identSelecteurMotifsAbsInternat = this.add(
      ObjetSelecteurMotifAbsence_1.ObjetSelecteurMotifAbsence,
      this._evntSelecteurMotif,
    );
    this.identSelecteurMotifsRetard = this.add(
      ObjetSelecteurMotifAbsence_1.ObjetSelecteurMotifAbsence,
      this._evntSelecteurMotif,
    );
    this.identSelecteurMotifsInfirmerie = this.add(
      ObjetSelecteurMotifInfirmerie_1.ObjetSelecteurMotifInfirmerie,
      this._evntSelecteurMotif,
    );
    this.idComboTypeDecompteAbs = this.add(
      ObjetSaisie_1.ObjetSaisie,
      this.evntComboTypeDecompteAbs,
      this.initComboTypeDecompteAbs,
    );
  }
  initComboTypeDecompteAbs(aInstance) {
    aInstance.setOptionsObjetSaisie({
      longueur: 130,
      labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
        "RecapAbs.WAI_TypeDecompteAbsence",
      ),
    });
    const lListeTypeDecompte = new ObjetListeElements_1.ObjetListeElements();
    lListeTypeDecompte.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.HeureCours"),
        null,
        TypeChoixComptabilisation_1.TypeChoixComptabilisation.HeuresDeCours,
      ),
    );
    lListeTypeDecompte.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.DJBrute"),
        null,
        TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJBrutes,
      ),
    );
    lListeTypeDecompte.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.DJCalcule"),
        null,
        TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJCalculees,
      ),
    );
    lListeTypeDecompte.addElement(
      new ObjetElement_1.ObjetElement(
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.DJBulletin"),
        null,
        TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJBulletin,
      ),
    );
    aInstance.setDonneesObjetSaisie({ liste: lListeTypeDecompte });
  }
  evntComboTypeDecompteAbs(aParams) {
    switch (aParams.genreEvenement) {
      case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
        this.selection.typeDecompteAbs = aParams.element.getGenre();
        this.actualiserLibelleGBAbsences();
        this.actualiserDonnees({ avecModifChoixCompta: true });
        break;
      default:
        break;
    }
  }
  evntSurCBGpe(aGenre) {
    switch (aGenre) {
      case GenreParametreRecapAbsences.cbGpeAbsences:
        this.getInstance(this.idComboTypeDecompteAbs).setActif(
          this.selection.avecGpeAbsences,
        );
        this.getInstance(this.identSelecteurMotifsAbs).setActif(
          this.selection.avecGpeAbsences,
        );
        break;
      case GenreParametreRecapAbsences.cbGpeAbsRepas:
        this.getInstance(this.identSelecteurMotifsAbsRepas).setActif(
          this.selection.avecGpeAbsRepas,
        );
        break;
      case GenreParametreRecapAbsences.cbGpeAbsInternat:
        this.getInstance(this.identSelecteurMotifsAbsInternat).setActif(
          this.selection.avecGpeAbsInternat,
        );
        break;
      case GenreParametreRecapAbsences.cbGpeRetard:
        this.getInstance(this.identSelecteurMotifsRetard).setActif(
          this.selection.avecGpeRetard,
        );
        break;
      case GenreParametreRecapAbsences.cbGpeInfirmerie:
        this.getInstance(this.identSelecteurMotifsInfirmerie).setActif(
          this.selection.avecGpeInfirmerie,
        );
        break;
    }
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
    );
    H.push(
      '<legend class="',
      ObjetClass_1.GClass.getLegende(),
      '">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.criteresCommuns"),
      "</legend>",
    );
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquNonRA,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquNonRA"),
      "</ie-checkbox></div>",
    );
    H.push(
      '<div><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquInfAge,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquJeunes"),
    );
    H.push(
      '<input type="text" ie-model="inputModelTexte(',
      GenreParametreRecapAbsences.editBorneAge,
      ')" ie-mask="/[^0-9]/i" class="round-style MargeGauche" maxLength="3" style="',
      ObjetStyle_1.GStyle.composeWidth(30),
      '"/>',
    );
    H.push("</ie-checkbox></div>");
    H.push("</fieldset>");
    H.push(
      '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
    );
    H.push(
      '<legend class="',
      ObjetClass_1.GClass.getLegende(),
      ' NoWrap">',
      '<ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbGpeAbsences,
      ')" class="Espace InlineBlock AlignementHaut">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.titreAbs"),
      "</ie-checkbox>",
      '<div class="EspaceBas InlineBlock AlignementHaut" id="',
      this.getNomInstance(this.idComboTypeDecompteAbs),
      '"></div>',
      "</legend>",
    );
    H.push(
      '<div class="EspaceBas" id="',
      this.getNomInstance(this.identSelecteurMotifsAbs),
      '"></div>',
    );
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquAbsSup,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquAbsSup"),
    );
    H.push(
      '<input type="text" ie-model="inputModelTexte(',
      GenreParametreRecapAbsences.editBorneDJAbsSup,
      ')" ie-mask="/[^0-9]/i" class="round-style MargeGauche" maxLength="3" style="',
      ObjetStyle_1.GStyle.composeWidth(30),
      '"/>',
    );
    H.push('<span class="MargeGauche" id="', this.idDemi, '"></span>');
    H.push("</ie-checkbox></div>");
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquTotAbsSup,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquAbsTotSup"),
    );
    H.push(
      '<input type="text" ie-model="inputModelTexte(',
      GenreParametreRecapAbsences.editBorneDJTotAbsSup,
      ')" ie-mask="/[^0-9]/i" class="round-style MargeGauche" maxLength="3" style="',
      ObjetStyle_1.GStyle.composeWidth(30),
      '"/>',
    );
    H.push('<span class="MargeGauche" id="', this.idDemiTot, '"></span>');
    H.push("</ie-checkbox></div>");
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquAbsInjust,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquAbsInjust"),
      "</ie-checkbox></div>",
    );
    H.push("</fieldset>");
    if (this.droits.avecChoixRepas) {
      H.push(
        '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
      );
      H.push(
        '<legend class="',
        ObjetClass_1.GClass.getLegende(),
        '">',
        '<ie-checkbox ie-model="cbParametreAff(',
        GenreParametreRecapAbsences.cbGpeAbsRepas,
        ')" class="Espace">',
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.absRepas"),
        "</ie-checkbox>",
        "</legend>",
      );
      H.push(
        '<div class="EspaceBas" id="',
        this.getNomInstance(this.identSelecteurMotifsAbsRepas),
        '"></div>',
      );
      H.push("</fieldset>");
    }
    if (this.droits.avecChoixInternat) {
      H.push(
        '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
      );
      H.push(
        '<legend class="',
        ObjetClass_1.GClass.getLegende(),
        '">',
        '<ie-checkbox ie-model="cbParametreAff(',
        GenreParametreRecapAbsences.cbGpeAbsInternat,
        ')" class="Espace">',
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.absInternat"),
        "</ie-checkbox>",
        "</legend>",
      );
      H.push(
        '<div class="EspaceBas" id="',
        this.getNomInstance(this.identSelecteurMotifsAbsInternat),
        '"></div>',
      );
      H.push("</fieldset>");
    }
    H.push(
      '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
    );
    H.push(
      '<legend class="',
      ObjetClass_1.GClass.getLegende(),
      '">',
      '<ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbGpeRetard,
      ')" class="Espace">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.titreRetard"),
      "</ie-checkbox>",
      "</legend>",
    );
    H.push(
      '<div class="EspaceBas" id="',
      this.getNomInstance(this.identSelecteurMotifsRetard),
      '"></div>',
    );
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquRetardSup,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquRetardSup"),
    );
    H.push(
      '<input type="text" ie-model="inputModelTexte(',
      GenreParametreRecapAbsences.editBorneRetardSup,
      ')" ie-mask="/[^0-9]/i" class="round-style MargeGauche" maxLength="3" style="',
      ObjetStyle_1.GStyle.composeWidth(30),
      '"/>',
    );
    H.push("</ie-checkbox></div>");
    H.push(
      '<div class="EspaceBas"><ie-checkbox ie-model="cbParametreAff(',
      GenreParametreRecapAbsences.cbUniquRetardInjust,
      ')" class="Espace NoWrap">',
      ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquRetardInjust"),
      "</ie-checkbox></div>",
    );
    H.push("</fieldset>");
    if (this.droits.avecChoixInfirmerie) {
      H.push(
        '<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
      );
      H.push(
        '<legend class="',
        ObjetClass_1.GClass.getLegende(),
        '">',
        '<ie-checkbox ie-model="cbParametreAff(',
        GenreParametreRecapAbsences.cbGpeInfirmerie,
        ')" class="Espace">',
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.infirmerie"),
        "</ie-checkbox>",
        "</legend>",
      );
      H.push(
        '<div class="EspaceBas" id="',
        this.getNomInstance(this.identSelecteurMotifsInfirmerie),
        '"></div>',
      );
      H.push("</fieldset>");
    }
    return H.join("");
  }
  recupererDonnees() {}
  setDonnees(aParam) {
    this.selection = aParam.selection;
    const lInst = this.getInstance(this.idComboTypeDecompteAbs);
    lInst.initialiser();
    lInst.initSelection(
      lInst
        .getListeElements()
        .getIndiceParNumeroEtGenre(null, this.selection.typeDecompteAbs),
    );
    this.getInstance(this.identSelecteurMotifsAbs).setDonnees({
      listeSelection: aParam.motifsAbsences,
      listeTotale: aParam.motifsAbsences,
      genreRessource: Enumere_Ressource_1.EGenreRessource.Absence,
    });
    if (this.droits.avecChoixRepas) {
      this.getInstance(this.identSelecteurMotifsAbsRepas).setDonnees({
        listeSelection: aParam.motifsAbsRepas,
        listeTotale: aParam.motifsAbsRepas,
        genreRessource: Enumere_Ressource_1.EGenreRessource.AbsenceRepas,
      });
    }
    if (this.droits.avecChoixInternat) {
      this.getInstance(this.identSelecteurMotifsAbsInternat).setDonnees({
        listeSelection: aParam.motifsAbsInternat,
        listeTotale: aParam.motifsAbsInternat,
        genreRessource: Enumere_Ressource_1.EGenreRessource.AbsenceInternat,
      });
    }
    this.getInstance(this.identSelecteurMotifsRetard).setOptions({
      titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
        "RecapAbs.selectionMotifsRetard",
      ),
      titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
        "RecapAbs.motifsRetard",
      ),
    });
    this.getInstance(this.identSelecteurMotifsRetard).setDonnees({
      listeSelection: aParam.motifsRetard,
      listeTotale: aParam.motifsRetard,
      genreRessource: Enumere_Ressource_1.EGenreRessource.Retard,
    });
    this.getInstance(this.identSelecteurMotifsInfirmerie).setDonnees({
      listeSelection: aParam.issuesInfirmerie,
      listeTotale: aParam.issuesInfirmerie,
    });
  }
  actualiserDonnees(aParam) {
    this.callback.appel({
      evnt: ParamAffRecapAbsences.GenreCallback.actualiserDonnees,
      avecModifCBGpe: aParam.avecModifCBGpe,
      avecModifChoixCompta: aParam.avecModifChoixCompta,
    });
  }
  actualiserLibelleGBAbsences() {
    let lTraduc = "";
    switch (this.selection.typeDecompteAbs) {
      case TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJBrutes:
        lTraduc = ObjetTraduction_1.GTraductions.getValeur("RecapAbs.DJBrute");
        break;
      case TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJCalculees:
        lTraduc =
          ObjetTraduction_1.GTraductions.getValeur("RecapAbs.DJCalcule");
        break;
      case TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJBulletin:
        lTraduc = ObjetTraduction_1.GTraductions.getValeur(
          "RecapAbs.DJBulletin",
        );
        break;
      default:
        break;
    }
    if (
      this.selection.typeDecompteAbs !==
      TypeChoixComptabilisation_1.TypeChoixComptabilisation.HeuresDeCours
    ) {
      ObjetHtml_1.GHtml.setHtml(this.idDemi, lTraduc);
      ObjetHtml_1.GHtml.setHtml(this.idDemiTot, lTraduc);
    }
  }
}
exports.ParamAffRecapAbsences = ParamAffRecapAbsences;
(function (ParamAffRecapAbsences) {
  let GenreCallback;
  (function (GenreCallback) {
    GenreCallback[(GenreCallback["actualiserDonnees"] = 1)] =
      "actualiserDonnees";
  })(
    (GenreCallback =
      ParamAffRecapAbsences.GenreCallback ||
      (ParamAffRecapAbsences.GenreCallback = {})),
  );
})(
  ParamAffRecapAbsences ||
    (exports.ParamAffRecapAbsences = ParamAffRecapAbsences = {}),
);
