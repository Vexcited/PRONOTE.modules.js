const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_Import } = require("DonneesListe_Import.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GPosition } = require("ObjetPosition.js");
const { GUID } = require("GUID.js");
const { ObjetMoteurImports } = require("ObjetMoteurImports.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreImport } = require("Enumere_GenreImport.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
class ObjetFenetre_Import extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.moteur = new ObjetMoteurImports();
    this._optionsListe = {};
    const lGuid = GUID.getId();
    this.idTitre = lGuid + "_titre_";
    this.idLegende = lGuid + "_leg";
    this.idDetailLegende = lGuid + "_leg_detail";
    this.idCheckboxBareme = lGuid + "_checkbox_bareme";
    this.idCheckboxVisualiser = lGuid + "_checkbox_visualiser";
    this.identZoneSelectionService = lGuid + "_ZoneSelectionService";
    this.identZoneSelectionService_mirroir =
      lGuid + "_ZoneSelectionService_mirroir";
    this.listeService = null;
    this.service = null;
    this.avecBareme = false;
    this.baremeAvecDecimales = false;
    this.avecComboTableSiSeule = true;
    this.avecVisualiser = false;
    this.lignesParDefaut = 6;
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("ImportExport.TitreFenetre"),
      hauteur: 600,
      largeur: 900,
      listeBoutons: [
        {
          libelle: GTraductions.getValeur("Fermer"),
          theme: TypeThemeBouton.secondaire,
        },
        {
          libelle: GTraductions.getValeur("ImportExport.BtnImporter"),
          theme: TypeThemeBouton.primaire,
        },
      ],
    });
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe, _evntSurListe.bind(this));
    this.idSelectionService = this.add(ObjetSaisie, null, null);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      estVisible: function () {
        if (!aInstance.avecComboTableSiSeule) {
          return (
            !!aInstance._datas && aInstance._datas.tablesEtChamps.count() > 1
          );
        } else {
          return true;
        }
      },
      selectionTable: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            mode: EGenreSaisie.Combo,
            longueur: 210,
            hauteur: 17,
          });
        },
        getDonnees: function () {
          if (aInstance.donneesRecues && aInstance._datas.tablesEtChamps) {
            return aInstance._datas.tablesEtChamps;
          }
        },
        getIndiceSelection: function (aParametres) {
          return aParametres.Selection !== -1 ? aParametres.Selection : 0;
        },
        event: function (aParametres) {
          if (
            aInstance.donneesRecues &&
            aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection
          ) {
            _evntSurSelectionTable.call(aInstance, aParametres.element);
          }
        },
        getDisabled: function () {
          return !aInstance.avecComboTableSiSeule;
        },
      },
      getBareme: {
        getValue: function () {
          return this.node.checked;
        },
        setValue: function (aValue) {
          this.node.checked = aValue;
          setBareme(this, aValue);
        },
        getDisabled: function () {
          return false;
        },
      },
      selectionService: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            mode: EGenreSaisie.Combo,
            longueur: 312,
            hauteur: 17,
          });
        },
        getDonnees: function () {
          if (aInstance.listeService) {
            return aInstance.listeService;
          }
        },
        getIndiceSelection: function (aParametres) {
          return aParametres.Selection !== -1 ? aParametres.Selection : 0;
        },
        getLibelle: function (aInstance, aData) {
          const lElement = aInstance.ListeElements.get(aData.$indice);
          aInstance.setContenu(
            (lElement.pere !== undefined
              ? lElement.pere.matiere.getLibelle() + " - "
              : "") +
              (lElement.pere !== undefined && lElement.pere.estCoEnseignement
                ? lElement.professeur.getLibelle() + " - "
                : "") +
              lElement.getLibelle() +
              " - " +
              (lElement.groupe.existeNumero()
                ? lElement.groupe.getLibelle()
                : lElement.classe.getLibelle()) +
              (lElement.listeProfesseurs
                ? " - " + lElement.listeProfesseurs.get(0).getLibelle()
                : ""),
          );
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection
          ) {
            aInstance.service = aParametres.element;
          }
        },
        getDisabled: function (aInstance) {
          return aInstance.ListeElements !== undefined
            ? aInstance.ListeElements.count() === 1
            : true;
        },
      },
      getVisualiser: {
        getValue: function () {
          return this.node.checked;
        },
        setValue: function (aValue) {
          this.node.checked = aValue;
          setVisualiser(this, aValue);
        },
        getDisabled: function () {
          const lNbrLigne =
            aInstance._datas !== undefined
              ? aInstance._datas.donneesMetierSrc.get(0).lignes.count()
              : 0;
          if (lNbrLigne <= aInstance.lignesParDefaut) {
            this.node.checked = true;
            return true;
          }
          return false;
        },
      },
      btnParcourir: {
        getOptionsSelecFile: function () {
          return {
            maxSize: 500 * 1024 * 1024,
            extensions: ["xlsx", "xls", "xlsm", "xlsb", "ods", "csv", "txt"],
          };
        },
        addFiles: function (aParametres) {
          aInstance.callback.pere
            .getInstance(aInstance.callback.pere.identUtilImport)
            .surSelectionFichierImport(aParametres.event);
        },
      },
    });
  }
  avecBaremePremiereLigne() {
    return false;
  }
  composeContenu() {
    const H = [];
    const lClassEltLigne = "InlineBlock AlignementMilieuVertical Espace";
    H.push('<div class="NoWrap">');
    H.push(
      '<label class="',
      lClassEltLigne,
      '" ie-display="estVisible">',
      GTraductions.getValeur("Import.TypeDonneeAImporter"),
      "</label>",
      '<ie-combo class="',
      lClassEltLigne,
      '" ie-model="selectionTable" ie-display="estVisible"></ie-combo>',
    );
    if (this.listeService) {
      H.push(
        '<label class="',
        lClassEltLigne,
        '">',
        GTraductions.getValeur("FenetreDevoir.Service"),
        "</label>",
        '<ie-combo class="',
        lClassEltLigne,
        '" ie-model="selectionService"></ie-combo>',
      );
    }
    H.push("</div>");
    H.push('<div class="Espace">');
    H.push(
      GTraductions.getValeur("ImportExport.LocalisationFichier"),
      '<span class="EspaceGauche" style="color:',
      GCouleur.eleve.garcon,
      '">',
      this.file !== undefined ? this.file.name : "",
      "</span>",
    );
    H.push(
      '<span class="GrandEspaceGauche"> <ie-bouton ie-model="btnParcourir" ie-selecfile class="',
      TypeThemeBouton.secondaire,
      '">',
      GTraductions.getValeur("ImportExport.Parcourir"),
      "</ie-bouton> </span>",
    );
    H.push("</div>");
    H.push(
      '<div id="',
      this.getInstance(this.identListe).getNom(),
      '" class="EspaceBas" style="height:600px; width:100%;"></div>',
    );
    H.push('<div class="NoWrap">');
    H.push(
      '<div class="InlineBlock GrandEspaceDroit" id="',
      this.idLegende,
      '">',
      GTraductions.getValeur("ImportExport.LegendeChpObl"),
      "</div>",
    );
    H.push(
      '<div class="InlineBlock TexteRouge" id="',
      this.idDetailLegende,
      '"></div>',
    );
    if (this.avecBaremePremiereLigne()) {
      H.push(
        '<ie-checkbox id="',
        this.idCheckboxBareme,
        '" class=" GrandEspaceGauche AvecMain" ie-model="getBareme"/>',
        GTraductions.getValeur("Import.BaremePremiereLigne"),
      );
    }
    H.push("</div>");
    H.push(
      '<div class="NoWrap"> <ie-checkbox id="',
      this.idCheckboxVisualiser,
      '" class="Espace GrandespaceDroit AvecMain" ie-model="getVisualiser"/>',
      GTraductions.getValeur("ImportExport.ToutVisualiser"),
      "</div>",
    );
    return H.join("");
  }
  actualiserSelectionService() {}
  setDonnees(aParam, aListeServices) {
    this.donneesRecues = true;
    this._datas = {
      donneesMetierSrc: aParam.donnees.donneesImport,
      tablesEtChamps: aParam.listeTablesImportables.parcourir((D) => {
        D.Libelle = D.nomRef;
      }),
    };
    this.file = aParam.file;
    this.avecFormatDateUnique = aParam.avecFormatDateUnique;
    this.actualiserSelectionService(aListeServices);
    this.mapping = new ObjetElement();
    this.mapping.tables = new ObjetListeElements();
    const lOptionsListe = this.actualiserDonneesMetier();
    $.extend(this._optionsListe, lOptionsListe);
    if (lOptionsListe !== null && lOptionsListe !== undefined) {
      this.actualiserListe();
      this.actualiser();
    }
  }
  actualiserDonneesMetier() {
    const lSheet = this._datas.donneesMetierSrc.get(0);
    const lNbColonnes = lSheet.colonnes.count();
    let lNbLignes = lSheet.lignes.count();
    this.setBoutonActif(1, false);
    const lEstSheetVide = lNbColonnes === 0 && lNbLignes === 0;
    if (lEstSheetVide === true) {
      this.afficher(
        this.composeMessage(
          GTraductions.getValeur("ImportExport.AucuneDonneeDansFichierImport"),
        ),
      );
    } else {
      const lOptionsListe = {
        scrollHorizontal: true,
        boutons: [{ genre: ObjetListe.typeBouton.rechercher, widthInput: 90 }],
      };
      return lOptionsListe;
    }
  }
  actualiserLegendeListe() {
    let lDetail = "&nbsp;";
    const lNbChpOblNonAssocie = this.moteur.nbChampsObligatoiresNonAssocies({
      mapping: this.mapping,
      table: this.tableSelectionnee,
    });
    if (lNbChpOblNonAssocie > 0) {
      lDetail = GTraductions.getValeur(
        "ImportExport.LegendeDetailNbChpOblManquant",
        [lNbChpOblNonAssocie],
      );
    }
    GHtml.setHtml(this.idDetailLegende, lDetail);
  }
  actualiserListe() {
    const lOptionsListe = {
      colonnes: _getListeInfoColonnes.call(
        this,
        this._datas.donneesMetierSrc.get(0).colonnes,
      ),
    };
    $.extend(this._optionsListe, lOptionsListe);
    this.afficher();
    this.getInstance(this.identListe)
      .setOptionsListe(this._optionsListe)
      .setDonnees(
        new DonneesListe_Import(
          this._datas.donneesMetierSrc.get(0).lignes,
          {
            tableReference: this.tableSelectionnee,
            mappingFormatImport: this.mapping,
          },
          this._datas.donneesMetierSrc.get(0).colonnes,
          {
            avecBareme: this.avecBareme,
            baremeAvecDecimales: this.baremeAvecDecimales,
          },
          this.avecVisualiser,
          this.avecFormatDateUnique,
        ),
      );
    this.actualiserLegendeListe();
  }
  surValidation(ANumeroBouton) {
    this.fermer();
    const lTable = this.tableSelectionnee;
    const lMappingTable = this.moteur.getMappingDeTable({
      refTable: lTable.nomRef,
      mapping: this.mapping,
    });
    this.callback.appel(ANumeroBouton, {
      mapping: lMappingTable,
      avecBareme: this.avecBareme,
      service: this.service,
    });
  }
}
function _evntSurListe(aParam) {
  switch (aParam.genreEvenement) {
    case EGenreEvenementListe.Suppression:
      for (let i = 0, lNbr = aParam.listeSuppressions.count(); i < lNbr; i++) {
        this.moteur.supprimerLigne(
          aParam.instance.getDonneesListe(),
          aParam.listeSuppressions.get(i).Numero,
        );
      }
      break;
    case EGenreEvenementListe.ApresSuppression:
      this.actualiserListe();
      break;
    case EGenreEvenementListe.ApresEdition:
      this.actualiserListe();
      break;
    default:
      break;
  }
}
function setVisualiser(aThis, aValue) {
  aThis.instance.avecVisualiser = aValue;
  aThis.instance.actualiserListe();
}
function setBareme(aThis, aValue) {
  aThis.instance.avecBareme = aValue;
  aThis.instance.actualiserListe();
}
function _evntSurSelectionTable(aEltSelection) {
  this.tableSelectionnee = aEltSelection;
  this.actualiserListe();
}
function _evntSurClickTitreCol(aParam) {
  const lJQTitre = $("#" + aParam.idElt.escapeJQ())
    .parent()
    .parent();
  const lEltTitre = lJQTitre.get(0);
  ObjetMenuContextuel.afficher({
    pere: this,
    options: { largeurMin: 100 },
    initCommandes: initCmdsMenuContextuel.bind(this, aParam.indiceCol),
    id: {
      x: GPosition.getLeft(lEltTitre),
      y: GPosition.getTop(lEltTitre) + GPosition.getHeight(lEltTitre) + 2,
    },
  });
}
function initCmdsMenuContextuel(aIndiceCol, aMenu) {
  let lStrCmd;
  const lThis = this;
  lStrCmd = this.moteur.getStrChamp({
    strChamp: GTraductions.getValeur("Import.ChampIgnore"),
    Obligatoire: false,
    avecAlignement: true,
  });
  aMenu.add(
    lStrCmd,
    true,
    function (aIndiceCol, aNomRefChamp) {
      evntSurMenuContextuel.call(this, aIndiceCol, aNomRefChamp);
    }.bind(this, aIndiceCol, null),
  );
  aMenu.addSeparateur();
  const lTable = this.tableSelectionnee;
  if (lTable && lTable.SousChamps !== undefined && lTable.SousChamps !== null) {
    for (let i = 0, lNbr = lTable.SousChamps.length; i < lNbr; i++) {
      const lChamp = lTable.SousChamps[i];
      initCmdsSousMenu(
        { champ: lChamp, pere: lTable, table: lTable, menu: aMenu },
        i,
        aIndiceCol,
        lThis,
      );
    }
  }
}
function initCmdsSousMenu(aParam, I, aIndiceCol, aThis) {
  const lChamp = aParam.champ;
  const lPere = aParam.pere;
  const lTable = aParam.table;
  const lMenu = aParam.menu;
  const lOptionInvisible = !!(
    lPere.Genre === EGenreImport.Composite ||
    lChamp.Genre === EGenreImport.Composite
  );
  const lEstDejaAssocie = aThis.moteur.estChampAssocie({
    nomRefChamp: lChamp.nomRef,
    refTable: lTable.nomRef,
    mapping: aThis.mapping,
  });
  const lEstCompoAssocie = aThis.moteur.estChampAssocie({
    nomRefChamp: lChamp,
    refTable: lTable.nomRef,
    mapping: aThis.mapping,
  });
  const lEstFilsCompoAssocie = aThis.moteur.estChampAssocie({
    nomRefChamp: lPere,
    refTable: lTable.nomRef,
    mapping: aThis.mapping,
  });
  const lAvecPereObliAssocie = aThis.moteur.avecPereObliAssocie({
    pere: lPere,
    table: lTable,
    mapping: aThis.mapping,
  });
  const lEstPereAvcChpObliManqnt =
    aThis.moteur.estPereAvecChampObligatoireManquant({
      pere: lChamp,
      table: lTable,
      mapping: aThis.mapping,
    });
  const lEstObligatoire = aThis.moteur.estChampObligatoire({
    nomRefChamp: lChamp.nomRef,
    table: lTable,
    mapping: aThis.mapping,
  });
  const lAvecPereObigatoire = aThis.moteur.estChampObligatoire({
    nomRefChamp: lPere.nomRef,
    table: lTable,
    mapping: aThis.mapping,
  });
  const lStrCmd = aThis.moteur.getStrChamp({
    strChamp: lChamp.nomRef,
    Obligatoire: lEstObligatoire,
    avecAlignement: true,
  });
  const lStyleChamp =
    lEstDejaAssocie || (lEstCompoAssocie && !lEstPereAvcChpObliManqnt)
      ? "font-weight: bold;"
      : lEstObligatoire ||
          lEstPereAvcChpObliManqnt ||
          (lOptionInvisible &&
            ((lAvecPereObigatoire && !lEstFilsCompoAssocie) ||
              (lChamp.Obligatoire && !lAvecPereObliAssocie)))
        ? "color:red"
        : "";
  const lHtml = '<div style="' + lStyleChamp + '">' + lStrCmd + "</div>";
  if (lChamp.Genre === EGenreImport.Composite) {
    if (lOptionInvisible) {
      const lCompo = lPere.SousChamps[I];
      for (let j = 0, lNbr = lCompo.SousChamps.length; j < lNbr; j++) {
        initCmdsSousMenu(
          {
            champ: lCompo.SousChamps[j],
            pere: lCompo,
            table: lTable,
            menu: lMenu,
          },
          j,
          aIndiceCol,
          aThis,
        );
      }
    } else {
      lMenu.addSousMenu(
        lHtml,
        ((I, aInstanceSousMenu) => {
          const lCompo = lPere.SousChamps[I];
          for (let j = 0, lNbr = lCompo.SousChamps.length; j < lNbr; j++) {
            initCmdsSousMenu(
              {
                champ: lCompo.SousChamps[j],
                pere: lCompo,
                table: lTable,
                menu: aInstanceSousMenu,
              },
              j,
              aIndiceCol,
              aThis,
            );
          }
        }).bind(aThis, I),
      );
    }
  } else {
    lMenu.add(
      lHtml,
      true,
      ((aIndiceCol, aNomRefChamp) => {
        evntSurMenuContextuel.call(aThis, aIndiceCol, aNomRefChamp);
      }).bind(aThis, aIndiceCol, lChamp.nomRef),
    );
  }
}
function evntSurMenuContextuel(aCol, aNomRefChamp) {
  this.moteur.ajouterCorrespondance({
    col: aCol,
    nomRefChamp: aNomRefChamp,
    mapping: this.mapping,
    table: this.tableSelectionnee,
  });
  this.actualiserListe();
}
function _getStrTitreCol(aIndiceCol) {
  const lChampDeCol = this.moteur.getChampAssocieCol({
    col: aIndiceCol,
    mapping: this.mapping,
    table: this.tableSelectionnee,
  });
  if (lChampDeCol !== null && lChampDeCol !== undefined) {
    return lChampDeCol.nomRef;
  } else {
    return GTraductions.getValeur("Import.ChampIgnore");
  }
}
function _getListeInfoColonnes(aCols) {
  const lResult = [];
  const lThis = this;
  this.getInstance(this.identListe).controleur.getNodeTitreCol = function (i) {
    const lIdTitre = this.node.id;
    const lParam = { indiceCol: i, idElt: lIdTitre };
    $(this.node).on(
      "click",
      function (aParam) {
        _evntSurClickTitreCol.call(this, aParam);
      }.bind(lThis, lParam),
    );
  };
  this.getInstance(this.identListe).controleur.getHint = function (
    aEstColonneValide,
    i,
  ) {
    switch (aEstColonneValide) {
      case false: {
        const lChamp = this.instance.Donnees.moteur.getChampAssocieCol({
          col: i,
          mapping: this.instance.Donnees.mappingFormatImport,
          table: this.instance.Donnees.tableReference,
        });
        if (lChamp.Genre === EGenreImport.Enumere) {
          return GTraductions.getValeur("ImportExport.HintMauvaisEnumere", [
            lChamp.Contraintes,
          ]);
        } else {
          if (lChamp.Genre === EGenreImport.Date) {
            const lFormat = this.avecFormatDateUnique
              ? "ImportExport.FormatDateUnique"
              : "ImportExport.FormatDateEurope";
            return GTraductions.getValeur(
              "ImportExport.HintMauvaisFormatDate",
              [GTraductions.getValeur(lFormat)],
            );
          }
          return GTraductions.getValeur("ImportExport.HintMauvaisGenre", [
            lChamp.nomRef,
          ]);
        }
      }
      case true:
        return "";
      default:
        return "";
    }
  };
  if (aCols.count() > 0) {
    const lNbr = aCols.count();
    for (let i = 0; i < lNbr; i++) {
      const lElt = aCols.get(i);
      let lEstColonneValide, lColonne, lTitre;
      const lEstObligatoire = this.moteur.estChampDeColObligatoire({
        col: i,
        mapping: this.mapping,
        table: this.tableSelectionnee,
      });
      const lStrTitre = this.moteur.getStrChamp({
        strChamp: _getStrTitreCol.call(this, i),
        Obligatoire: lEstObligatoire,
        avecAlignement: false,
      });
      const lRefTable =
        this.tableSelectionnee !== undefined
          ? this.tableSelectionnee.nomRef
          : this.tableSelectionnee;
      const lMappingTable = this.moteur.getMappingDeTable({
        refTable: lRefTable,
        mapping: this.mapping,
      });
      const lMapCol = this.moteur.getMappingDeColonne({
        col: i,
        mappingTable: lMappingTable,
      });
      if (
        this.getInstance(this.identListe).getDonneesListe() !== undefined &&
        lMapCol !== undefined
      ) {
        lEstColonneValide = this.moteur.estColonneValide(
          {
            donnees: this.getInstance(this.identListe).getDonneesListe()
              .donneesColonnes,
            mapping: this.mapping,
            table: this.tableSelectionnee,
          },
          i,
          {
            avecBareme: this.avecBareme,
            baremeAvecDecimales: this.baremeAvecDecimales,
          },
        );
        if (lEstColonneValide === true) {
          lTitre = {
            libelleHtml:
              '<div ie-node="getNodeTitreCol(' +
              i +
              ')" ie-hint="getHint(' +
              lEstColonneValide +
              "," +
              i +
              ')" class="AvecMain AlignementGauche" id="' +
              this.idTitre +
              i +
              '">' +
              lStrTitre +
              "</div>",
          };
        } else if (lEstColonneValide === false) {
          lTitre = {
            libelleHtml:
              '<div ie-node="getNodeTitreCol(' +
              i +
              ')" ie-hint="getHint(' +
              lEstColonneValide +
              "," +
              i +
              ')" style="color:red" class="AvecMain AlignementGauche" id="' +
              this.idTitre +
              i +
              '">' +
              lStrTitre +
              "</div>",
          };
        }
      } else {
        lTitre = {
          libelleHtml:
            '<div ie-node="getNodeTitreCol(' +
            i +
            ')" class="AvecMain AlignementGauche" id="' +
            this.idTitre +
            i +
            '">' +
            lStrTitre +
            "</div>",
        };
      }
      lColonne = { id: lElt.Numero.toString(), taille: 100, titre: lTitre };
      lResult.push(lColonne);
    }
    if (this.getInstance(this.identListe).getDonneesListe() !== undefined) {
      const lBoolean = this.moteur.estImportPossible(
        {
          donnees: this.getInstance(this.identListe).getDonneesListe()
            .donneesColonnes,
          mapping: this.mapping,
          table: this.tableSelectionnee,
          ligneSuppr: this.getInstance(this.identListe).getDonneesListe()
            .Donnees.LignesSupprimees,
        },
        {
          avecBareme: this.avecBareme,
          baremeAvecDecimales: this.baremeAvecDecimales,
        },
      );
      this.setBoutonActif(1, lBoolean);
    }
  }
  return lResult;
}
module.exports = { ObjetFenetre_Import };
