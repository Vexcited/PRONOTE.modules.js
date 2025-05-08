const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_DocumentsEleve,
} = require("ObjetFenetre_DocumentsEleve.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ToucheClavier } = require("ToucheClavier.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
  TypeColSaisieApprPiedDeBulletin,
} = require("TypeColonneSaisieApprPiedDeBulletin.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
class DonneesListe_ApprGenerale extends ObjetDonneesListe {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.moteurPdB = new ObjetMoteurPiedDeBulletin();
    this.param = $.extend(
      {
        instanceListe: null,
        typeReleveBulletin: null,
        listeColVisibles: null,
        estCtxRubrique: false,
        avecSelectionPeriodePrec: false,
        listePeriodesPrec: null,
        callbackOuvrirAssSaisie: null,
        avecMultiSelectionLignes: false,
      },
      aParam,
    );
    if (
      this.param.avecSelectionPeriodePrec === true &&
      this.param.listePeriodesPrec !== null &&
      this.param.listePeriodesPrec !== undefined &&
      this.param.listePeriodesPrec.count() > 0
    ) {
      this.param.periodePrecCourante = this.param.listePeriodesPrec.get(
        this.param.listePeriodesPrec.count() - 1,
      );
    }
    if (this.param.instanceListe !== null) {
      this.initOptions(this.param.instanceListe, this.param);
    }
    this.setOptions({
      hauteurMinCellule: DonneesListe_ApprGenerale.dimensions.hauteurLigne,
      hauteurMinContenuCellule: ObjetDonneesListe.hauteurMinCellule,
      avecDeploiement: false,
      avecTri: false,
      avecSuppression: false,
      editionApresSelection: false,
      avecEvnt_Selection: true,
      avecEvnt_ApresEdition: true,
      avecEvnt_ApresEditionValidationSansModification: true,
      avecMultiSelection: this.param.avecMultiSelectionLignes,
    });
  }
  avecSelection(aParams) {
    if (
      _estColEditable.call(this, {
        idColonne: DonneesListe_ApprGenerale.colonnes.appreciationGenerale,
      })
    ) {
      const lAppr = aParams.article.appreciationGle;
      if (
        !lAppr ||
        !lAppr.editable ||
        this.moteurPdB.estMention({ appreciation: lAppr })
      ) {
        return false;
      }
    }
    return true;
  }
  getControleur(aDonneesListe) {
    return $.extend(true, super.getControleur(aDonneesListe), {
      nodePhoto: function (aNoArticle) {
        $(this.node).on("error", () => {
          const lIndiceElement =
            aDonneesListe.Donnees.getIndiceElementParFiltre(
              ((aLigne) => {
                const lEleve = aLigne.eleve;
                return lEleve.getNumero() === aNoArticle;
              }).bind(),
            );
          const lElement = aDonneesListe.Donnees.get(lIndiceElement);
          lElement.eleve.avecPhoto = false;
        });
      },
      surClicPiecesJointesProjAcc: function (aNoEleve) {
        $(this.node).on("click keyup", (aEvent) => {
          if (
            aEvent.type === "keyup" &&
            !(
              aEvent.which === ToucheClavier.Espace ||
              aEvent.which === ToucheClavier.RetourChariot
            )
          ) {
            return;
          }
          const lIndiceElement =
            aDonneesListe.Donnees.getIndiceElementParFiltre(
              ((aLigne) => {
                const lEleve = aLigne.eleve;
                return lEleve.getNumero() === aNoEleve;
              }).bind(),
            );
          const lElement = aDonneesListe.Donnees.get(lIndiceElement);
          if (
            !!lElement &&
            !!lElement.eleve &&
            !!lElement.eleve.avecDocsProjetsAccompagnement
          ) {
            const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_DocumentsEleve,
              { pere: aDonneesListe },
            );
            lInstanceFenetre.setDonnees(lElement.eleve);
          }
        });
      },
      comboPeriodePrec: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 90,
            hauteur: 16,
            hauteurLigneDefault: 16,
            labelWAICellule: GTraductions.getValeur(
              "WAI.ListeSelectionPeriode",
            ),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aDonneesListe.param.listePeriodesPrec;
          }
        },
        getIndiceSelection: function () {
          let lIndice = 0;
          if (
            !!aDonneesListe.param.periodePrecCourante &&
            !!aDonneesListe.param.listePeriodesPrec &&
            aDonneesListe.param.listePeriodesPrec.count() > 0
          ) {
            lIndice =
              aDonneesListe.param.listePeriodesPrec.getIndiceElementParFiltre(
                (D) => {
                  return (
                    D.getNumero() ===
                    aDonneesListe.param.periodePrecCourante.getNumero()
                  );
                },
              );
          }
          return Math.max(lIndice, 0);
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            !!aParametres.element &&
            aDonneesListe.param.periodePrecCourante.getNumero() !==
              aParametres.element.getNumero()
          ) {
            aDonneesListe.param.periodePrecCourante = aParametres.element;
            aDonneesListe.param.clbckSelectionPeriode();
          }
        },
      },
      getTitrePeriodePrec: function () {
        if (aDonneesListe.param.periodePrecCourante) {
          return aDonneesListe.param.periodePrecCourante.titreRappelPeriode;
        } else {
          return aDonneesListe.moteur.getTitreCol(
            aDonneesListe.param.listeColVisibles,
            DonneesListe_ApprGenerale.colonnes.periodePrec,
          );
        }
      },
      btnAssistantSaisieListe: {
        event() {
          const lSelections = this.instance.getListeElementsSelection();
          if (!!lSelections && lSelections.count() > 0) {
            GEtatUtilisateur.assistantSaisieActif = true;
            aDonneesListe.param.callbackOuvrirAssSaisie();
          }
        },
        getTitle() {
          return GTraductions.getValeur(
            "releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
          );
        },
        getDisabled() {
          let lResult = true;
          const lSelections = this.instance.getListeElementsSelection();
          if (!!lSelections && lSelections.count() > 0) {
            for (const lLigneElement of lSelections) {
              if (
                lLigneElement.appreciationGle &&
                lLigneElement.appreciationGle.editable
              ) {
                lResult = false;
                break;
              }
            }
          }
          return lResult;
        },
        getClass() {
          return this.controleur.btnAssistantSaisieListe.getDisabled.call(this)
            ? ""
            : "TitreListeSansTri";
        },
      },
    });
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.dureeAbs:
      case DonneesListe_ApprGenerale.colonnes.nbRetards:
      case DonneesListe_ApprGenerale.colonnes.moyEleve:
        return ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_ApprGenerale.colonnes.evolution:
      case DonneesListe_ApprGenerale.colonnes.eleve:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
        return ObjetDonneesListe.ETypeCellule.ZoneTexte;
      default:
        return ObjetDonneesListe.ETypeCellule.Texte;
    }
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.eleve:
        if (!this.param.estCtxRubrique || aParams.article.estPere) {
          return this.moteur.composeHtmlEleve({
            eleve: aParams.article.eleve,
            avecPhoto: aParams.article.eleve.avecPhoto,
            largeurPhoto: DonneesListe_ApprGenerale.dimensions.largeurPhoto,
            hauteur: DonneesListe_ApprGenerale.dimensions.hauteurPhoto,
            strProjetAcc: aParams.article.eleve.projetsAccompagnement,
            avecDocsProjetAcc:
              aParams.article.eleve.avecDocsProjetsAccompagnement,
          });
        } else {
          const lAppr =
            DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
          return lAppr && lAppr.titre ? "<div>" + lAppr.titre + "</div>" : "";
        }
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
        const lAppr =
          DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
        return lAppr ? lAppr.getLibelle() : "";
      }
      case DonneesListe_ApprGenerale.colonnes.dureeAbs:
        return !!aParams.article.strHAbs ? aParams.article.strHAbs : "";
      case DonneesListe_ApprGenerale.colonnes.nbRetards:
        return !!aParams.article.strNbRetards
          ? aParams.article.strNbRetards
          : "";
      case DonneesListe_ApprGenerale.colonnes.moyEleve:
        return aParams.article.moyEleve !== null &&
          aParams.article.moyEleve !== undefined
          ? aParams.article.moyEleve
          : "";
      case DonneesListe_ApprGenerale.colonnes.evolution: {
        let lData = _getDataPeriodePrecCourante.call(this, aParams);
        return this.moteur.composeHtmlEvolution({
          genreEvol: lData !== null && !!lData.evolution ? lData.evolution : 0,
        });
      }
      case DonneesListe_ApprGenerale.colonnes.periodePrec: {
        let lData = _getDataPeriodePrecCourante.call(this, aParams);
        return this.moteur.composeHtmlPeriodePrec(lData);
      }
      default:
        return "";
    }
  }
  static getAppreciationDeColonne(aParams) {
    const D = aParams.article;
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.eleve:
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
        return D.appreciationGle;
      default:
    }
  }
  getClassCelluleConteneur(aParams) {
    const T = [];
    if (_estColAvecGras.call(this, aParams)) {
      T.push("Gras");
    }
    if (_estCellEditable.call(this, aParams)) {
      T.push(" AvecMain ");
    }
    if (_estColAvecAlignementDroit.call(this, aParams)) {
      T.push("AlignementDroit");
    } else if (_estColAvecAlignementMilieu(aParams)) {
      T.push("AlignementMilieu");
    }
    const lAvecCurseurInterdiction =
      !this.param.estEnConsultation && !_estCellEditable.call(this, aParams);
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
        if (lAvecCurseurInterdiction) {
          T.push("AvecInterdiction");
        } else {
          const lAppr =
            DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
          if (
            this.moteurAssSaisie.avecAssistantSaisieActif({
              appreciation: lAppr,
              estCtxApprGenerale: true,
            })
          ) {
            T.push("Curseur_AssistantSaisieActif");
          }
        }
        break;
    }
    return T.join(" ");
  }
  getCouleurCellule(aParams) {
    if (_estColFixe.call(this, aParams)) {
      return ObjetDonneesListe.ECouleurCellule.Fixe;
    } else if (_estColCouleurTotal.call(this, aParams)) {
      return ObjetDonneesListe.ECouleurCellule.Total;
    } else if (_estDonneeEditable.call(this, aParams)) {
      return ObjetDonneesListe.ECouleurCellule.Blanc;
    } else {
      return ObjetDonneesListe.ECouleurCellule.Gris;
    }
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
        const lAppr =
          DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
        return lAppr !== null && lAppr !== undefined && lAppr.cloture === true
          ? GTraductions.getValeur("BulletinEtReleve.appreciationGleCloture")
          : null;
      }
    }
  }
  avecEdition(aParams) {
    return _estCellEditable.call(this, aParams);
  }
  avecEvenementEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.evolution:
        return _estCellEditable.call(this, aParams);
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
        return (
          _estCellEditable.call(this, aParams) &&
          ((this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes &&
            this.moteurPdB.estMention({
              appreciation: aParams.article.appreciationGle,
            })) ||
            this.moteurAssSaisie.avecAssistantSaisieActif({
              estCtxApprGenerale: true,
            }))
        );
    }
    return false;
  }
  avecEtatSaisie() {
    return false;
  }
  autoriserChaineVideSurEdition() {
    return true;
  }
  getControleCaracteresInput(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
        return { tailleMax: this.param.tailleMaxAppreciation };
      default:
        return null;
    }
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
        const lAppr =
          DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
        lAppr.setLibelle(!!V ? V.trim() : "");
        lAppr.setEtat(EGenreEtat.Modification);
        break;
      }
    }
  }
  avecMenuContextuel() {
    return false;
  }
  initOptions(aInstance, aParam) {
    aInstance.setOptionsListe({
      colonnes: this.getColonnesOrdonneesSelonContexte(aParam),
      avecLigneTotal: false,
      colonnesTriables: false,
      nonEditableSurModeExclusif: true,
    });
  }
  getHauteurMinCellule() {
    return DonneesListe_ApprGenerale.dimensions.hauteurPhoto;
  }
  getColonnesOrdonneesSelonContexte(aParam) {
    const lColonnes = [];
    if (aParam && aParam.listeColVisibles) {
      aParam.listeColVisibles.parcourir((aCol) => {
        const lIdCol = aCol.typeCol.toString();
        lColonnes.push({
          id: lIdCol,
          taille: _getDimensionCol.call(this, lIdCol),
          titre: _getTitreCol.call(this, { col: aCol }),
          hint:
            aCol.hintCol !== null && aCol.hintCol !== undefined
              ? aCol.hintCol
              : "",
        });
      });
    }
    return lColonnes;
  }
}
DonneesListe_ApprGenerale.colonnes = {
  eleve: TypeColSaisieApprPiedDeBulletin.cEleve.toString(),
  dureeAbs: TypeColSaisieApprPiedDeBulletin.cNbDJBulletin.toString(),
  nbRetards: TypeColSaisieApprPiedDeBulletin.cNbRetard.toString(),
  evolution: TypeColSaisieApprPiedDeBulletin.cEvolution.toString(),
  periodePrec: TypeColSaisieApprPiedDeBulletin.cRappelPeriodePRec.toString(),
  moyEleve: TypeColSaisieApprPiedDeBulletin.cMoyenne.toString(),
  appreciationGenerale:
    TypeColSaisieApprPiedDeBulletin.cAppreciation.toString(),
};
DonneesListe_ApprGenerale.dimensions = {
  largeurEleve: 250,
  largeurNote: 45,
  largeurRappelPeriodePrec: 250,
  largeurPhoto: 58,
  hauteurPhoto: 78,
  hauteurLigne: 40,
  largeurMinAppr: 160,
  largeurMaxAppr: 400,
};
function _getDataPeriodePrecCourante(aParams) {
  return this.moteur.getDataPeriodePrecCourante({
    listePeriodesPrec: aParams.article.listePeriodesPrec,
    avecSelectionPeriodePrec: this.param.avecSelectionPeriodePrec,
    periodePrecCourante: this.param.periodePrecCourante,
  });
}
function _getTitreCol(aParam) {
  const lCol = aParam.col;
  const lIdCol = lCol.typeCol.toString();
  switch (lIdCol) {
    case DonneesListe_ApprGenerale.colonnes.periodePrec:
      if (this.param.avecSelectionPeriodePrec) {
        return {
          libelleHtml: this.moteur.composeHtmlTitreCol({
            titreCol: this.param.periodePrecCourante
              ? this.param.periodePrecCourante.titreRappelPeriode
              : lCol.titreCol,
            ieTexteCol: "getTitrePeriodePrec",
            avecCombo: true,
            modelCombo: "comboPeriodePrec",
          }),
          ignorerOverflowHidden: true,
        };
      } else {
        return lCol.titreCol;
      }
    case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
      const lAvecAssistantSaisiePossible = true;
      const lTitreColonneAppreciation = [];
      lTitreColonneAppreciation.push('<div class="display-flex flex-center">');
      if (lAvecAssistantSaisiePossible) {
        lTitreColonneAppreciation.push(
          '<ie-btnicon ie-model="btnAssistantSaisieListe()" ie-class="getClass"',
          ' class="icon_pencil fix-bloc m-right-l"',
          ' style="font-size: 1.4rem;"',
          GObjetWAI.composeAttribut({
            genre: EGenreAttribut.label,
            valeur: GTraductions.getValeur(
              "releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
            ),
          }),
          "></ie-btnicon>",
        );
      }
      lTitreColonneAppreciation.push("<span>", lCol.titreCol, "</span>");
      lTitreColonneAppreciation.push("</div>");
      return { libelleHtml: lTitreColonneAppreciation.join("") };
    }
    default:
      return lCol.titreCol;
  }
}
function _estColEditable(aParams) {
  return this.moteur.estColEditable(
    this.param.listeColVisibles,
    aParams.idColonne,
  );
}
function _estColAvecGras(aParams) {
  return [DonneesListe_ApprGenerale.colonnes.moyEleve].includes(
    aParams.idColonne,
  );
}
function _estColAvecAlignementDroit(aParams) {
  return [
    DonneesListe_ApprGenerale.colonnes.moyEleve,
    DonneesListe_ApprGenerale.colonnes.dureeAbs,
    DonneesListe_ApprGenerale.colonnes.nbRetards,
  ].includes(aParams.idColonne);
}
function _estColAvecAlignementMilieu(aParams) {
  return [DonneesListe_ApprGenerale.colonnes.evolution].includes(
    aParams.idColonne,
  );
}
function _estColFixe(aParams) {
  const lTabColFixe = [DonneesListe_ApprGenerale.colonnes.eleve];
  return lTabColFixe.includes(aParams.idColonne);
}
function _estColCouleurTotal(aParams) {
  const lTabColTotal = [DonneesListe_ApprGenerale.colonnes.moyEleve];
  return lTabColTotal.includes(aParams.idColonne);
}
function _estDonneeEditable(aParams) {
  if (!_estColEditable.call(this, aParams)) {
    return false;
  }
  const D = aParams.article;
  switch (aParams.idColonne) {
    case DonneesListe_ApprGenerale.colonnes.evolution:
      return D.evolutionEditable !== null && D.evolutionEditable !== undefined
        ? D.evolutionEditable
        : false;
    case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
      const lAppr = DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
      return lAppr !== null && lAppr !== undefined ? lAppr.editable : false;
    }
  }
}
function _estCellEditable(aParams) {
  return _estDonneeEditable.call(this, aParams);
}
function _getDimensionCol(aTypeCol) {
  const lDimensions = DonneesListe_ApprGenerale.dimensions;
  switch (aTypeCol) {
    case DonneesListe_ApprGenerale.colonnes.eleve:
      return lDimensions.largeurEleve;
    case DonneesListe_ApprGenerale.colonnes.evolution:
    case DonneesListe_ApprGenerale.colonnes.moyEleve:
      return lDimensions.largeurNote;
    case DonneesListe_ApprGenerale.colonnes.periodePrec:
      return lDimensions.largeurRappelPeriodePrec;
    case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
      return ObjetListe.initColonne(
        100,
        lDimensions.largeurMinAppr,
        lDimensions.largeurMaxAppr,
      );
    default:
      return 80;
  }
}
module.exports = DonneesListe_ApprGenerale;
