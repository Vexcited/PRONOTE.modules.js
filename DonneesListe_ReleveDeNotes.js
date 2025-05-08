const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
class DonneesListe_ReleveDeNotes extends ObjetDonneesListe {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurGrille = new ObjetMoteurGrilleSaisie();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.param = $.extend(
      {
        instanceListe: null,
        affichage: null,
        saisie: false,
        moyGenerale: null,
        avecCorrige: null,
        clbckCorrigeQCM: null,
        clbckCalculMoy: null,
      },
      aParam,
    );
    if (this.param.instanceListe !== null && this.param.affichage !== null) {
      this.initOptions(this.param.instanceListe, this.param);
    }
    this.setOptions({
      avecDeploiement: true,
      avecTri: false,
      avecSuppression: false,
      avecEvenement: true,
      avecEdition: false,
      avecEvnt_KeyUpListe: false,
      avecEvnt_ApresEdition: true,
      avecEtatSaisie: false,
    });
  }
  getControleur(aInstanceDonneesListe, aInstanceListe) {
    return $.extend(
      true,
      super.getControleur(aInstanceDonneesListe, aInstanceListe),
      {
        getNodeCorrigeQCM: function (aIndLigne, aIndDevoir) {
          $(this.node).on(
            "click",
            function () {
              const lArticle = this.Donnees.get(aIndLigne);
              const lDevoir = lArticle.ListeDevoirs.get(aIndDevoir);
              this.param.clbckCorrigeQCM.call(this, lDevoir.executionQCM);
            }.bind(aInstanceDonneesListe),
          );
        },
        getNodeCalculMoy: function (aIndLigne, aIndCol, aIdCol) {
          $(this.node).on(
            "click",
            function () {
              const lArticle =
                aIndLigne !== -1
                  ? this.Donnees.get(aIndLigne)
                  : this.param.moyGenerale;
              const lParamEvnt = {
                service: lArticle.estUnDeploiement
                  ? lArticle.surMatiere
                  : lArticle,
                moyenneTrimestrielle:
                  aIdCol ===
                  DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
              };
              if (_estColMoyPeriode.call(this, aIdCol)) {
                const lParams = this.paramsListe.getParams(aIndCol, aIndLigne);
                const lIndice = lParams.declarationColonne.indice;
                $.extend(lParamEvnt, {
                  periode: this.param.affichage.listePeriodes.get(lIndice),
                });
              }
              this.param.clbckCalculMoy.call(this, lParamEvnt);
            }.bind(aInstanceDonneesListe),
          );
        },
      },
    );
  }
  _getPeriode(aParams) {
    if (_estColMoyPeriode.call(this, aParams.idColonne)) {
      const lNumero = aParams.declarationColonne.numeroPeriode;
      return aParams.article.ListeMoyennesPeriodes
        ? aParams.article.ListeMoyennesPeriodes.getElementParNumero(lNumero)
            .MoyennePeriode
        : aParams.article.surMatiere &&
            aParams.article.surMatiere.ListeMoyennesPeriodes
          ? aParams.article.surMatiere.ListeMoyennesPeriodes.getElementParNumero(
              lNumero,
            ).MoyennePeriode
          : null;
    }
  }
  _getMoyNRPeriode(aParams) {
    let lPeriode;
    if (_estColMoyPeriode.call(this, aParams.idColonne)) {
      const lNumero = aParams.declarationColonne.numeroPeriode;
      lPeriode = aParams.article.ListeMoyennesPeriodes
        ? aParams.article.ListeMoyennesPeriodes.getElementParNumero(lNumero)
        : aParams.article.surMatiere &&
            aParams.article.surMatiere.ListeMoyennesPeriodes
          ? aParams.article.surMatiere.ListeMoyennesPeriodes.getElementParNumero(
              lNumero,
            )
          : null;
    }
    if (lPeriode !== null && lPeriode !== undefined) {
      return lPeriode.estMoyNR;
    }
  }
  _getDevoir(aParams) {
    if (_estColDevoir.call(this, aParams.idColonne)) {
      const lIndice = aParams.declarationColonne.indice;
      return aParams.article.ListeDevoirs
        ? aParams.article.ListeDevoirs.get(lIndice)
        : null;
    }
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.regroupement:
        return aParams.article.estUnDeploiement === true
          ? ObjetDonneesListe.ETypeCellule.CocheDeploiement
          : ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
      case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneSup: {
        return ObjetDonneesListe.ETypeCellule.Note;
      }
      case DonneesListe_ReleveDeNotes.colonnes.appreciation:
        return ObjetDonneesListe.ETypeCellule.ZoneTexte;
      default: {
        if (_estColMoyPeriode.call(this, aParams.idColonne)) {
          return ObjetDonneesListe.ETypeCellule.Html;
        }
      }
    }
  }
  getValeur(aParams) {
    let lService;
    const lMoy = _getMoyenne.call(
      this,
      aParams.ligne,
      aParams.article,
      aParams,
    );
    if (aParams.article && aParams.article.estUnDeploiement) {
      switch (aParams.idColonne) {
        case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
          return this.moteur.composeHtmlNote({
            note: null,
            niveauDAcquisition: aParams.article.surMatiere.NiveauDAcquisition,
            genrePositionnement:
              TypePositionnementUtil.getGenrePositionnementParDefaut(
                aParams.article.surMatiere.TypePositionnementClasse,
              ),
            avecPrefixe: false,
          });
        case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
          return aParams.article.surMatiere.MoyenneEleve
            ? this.moteur.composeHtmlLienNoteCalculMoyenne({
                note: aParams.article.surMatiere.MoyenneEleve,
                ligne: aParams.ligne,
                colonne: aParams.colonne,
                idColonne: aParams.idColonne,
                estUnDeploiement: true,
              })
            : "";
        case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
          return aParams.article.surMatiere.MoyenneClasse;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
          return aParams.article.surMatiere.MoyenneMediane;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
          return aParams.article.surMatiere.MoyenneInf;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
          return aParams.article.surMatiere.MoyenneSup;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
          return aParams.article.surMatiere.MoyenneAnnuelle
            ? this.moteur.composeHtmlLienNoteCalculMoyenne({
                note: aParams.article.surMatiere.MoyenneAnnuelle,
                ligne: aParams.ligne,
                colonne: aParams.colonne,
                idColonne: aParams.idColonne,
                estUnDeploiement: true,
              })
            : "";
        case DonneesListe_ReleveDeNotes.colonnes.service:
          return aParams.article.getLibelle();
        case DonneesListe_ReleveDeNotes.colonnes.volumeHoraire:
          return aParams.article.surMatiere.volumeHoraire
            ? TUtilitaireDuree.dureeEnHeuresMinutes(
                aParams.article.surMatiere.volumeHoraire,
              ).toString("%xh%sh%om")
            : "";
        case DonneesListe_ReleveDeNotes.colonnes.coefficient:
          return aParams.article.surMatiere.Coefficient || "";
        case DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees:
          return aParams.article.surMatiere.heureCoursManquees
            ? TUtilitaireDuree.dureeEnHeuresMinutes(
                aParams.article.surMatiere.heureCoursManquees,
              ).toString("%xh%sh%om")
            : "";
        default:
          if (_estColMoyPeriode.call(this, aParams.idColonne)) {
            if (lMoy) {
              return this.moteur.composeHtmlLienNoteCalculMoyenne({
                note: lMoy,
                ligne: aParams.ligne,
                colonne: aParams.colonne,
                idColonne: aParams.idColonne,
                estUnDeploiement: true,
              });
            }
          }
          return "";
      }
    }
    let T = [];
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.regroupement:
        return "";
      case DonneesListe_ReleveDeNotes.colonnes.service: {
        lService = aParams.article.estService
          ? aParams.article
          : aParams.article.estPremier
            ? aParams.article.service
            : null;
        return this.moteur.composeHtmlService({
          service: lService,
          nbrMaxProfesseurs: DonneesListe_ReleveDeNotes.dimensions.nbMaxProfs,
        });
      }
      case DonneesListe_ReleveDeNotes.colonnes.sousService: {
        lService = aParams.article.estService ? null : aParams.article;
        return this.moteur.composeHtmlService({
          service: lService,
          nbrMaxProfesseurs: DonneesListe_ReleveDeNotes.dimensions.nbMaxProfs,
        });
      }
      case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle: {
        T = [];
        if (aParams.article.estMoyAnnuelleNR === true) {
          T.push(this.moteur.composeHtmlMoyNR());
        }
        if (lMoy !== null && lMoy !== undefined) {
          T.push(
            this.moteur.composeHtmlLienNoteCalculMoyenne({
              note: lMoy,
              ligne: aParams.ligne,
              colonne: aParams.colonne,
              idColonne: aParams.idColonne,
            }),
          );
        }
        return T.join("");
      }
      case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
        return this.moteur.composeHtmlNote({
          note: null,
          niveauDAcquisition: aParams.article.NiveauDAcquisition,
          genrePositionnement:
            TypePositionnementUtil.getGenrePositionnementParDefaut(
              aParams.article.TypePositionnementClasse,
            ),
          avecPrefixe: false,
        });
      case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve: {
        T = [];
        if (aParams.article.estMoyNR === true) {
          T.push(this.moteur.composeHtmlMoyNR());
        }
        if (
          aParams.article.MoyenneEleve !== null &&
          aParams.article.MoyenneEleve !== undefined
        ) {
          T.push(
            this.moteur.composeHtmlLienNoteCalculMoyenne({
              note: lMoy,
              ligne: aParams.ligne,
              colonne: aParams.colonne,
              idColonne: aParams.idColonne,
            }),
          );
        }
        return T.join("");
      }
      case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
      case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
        return lMoy;
      case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
        const lAppr = this.moteur.getApprDeService({
          typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
          article: aParams.article,
        }).appreciation;
        return lAppr !== null ? lAppr.getLibelle() : "";
      }
      case DonneesListe_ReleveDeNotes.colonnes.volumeHoraire:
        return aParams.article.volumeHoraire
          ? TUtilitaireDuree.dureeEnHeuresMinutes(
              aParams.article.volumeHoraire,
            ).toString("%xh%sh%om")
          : "";
      case DonneesListe_ReleveDeNotes.colonnes.coefficient:
        return aParams.article.Coefficient || "";
      case DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees:
        return aParams.article.heureCoursManquees
          ? TUtilitaireDuree.dureeEnHeuresMinutes(
              aParams.article.heureCoursManquees,
            ).toString("%xh%sh%om")
          : "";
      default: {
        if (_estColMoyPeriode.call(this, aParams.idColonne)) {
          T = [];
          const lPeriode = lMoy;
          const lEstMoyNRPeriode = this._getMoyNRPeriode(aParams);
          if (lEstMoyNRPeriode === true) {
            T.push(this.moteur.composeHtmlMoyNR());
          }
          if (lPeriode) {
            T.push(
              this.moteur.composeHtmlLienNoteCalculMoyenne({
                note: lMoy,
                ligne: aParams.ligne,
                colonne: aParams.colonne,
                idColonne: aParams.idColonne,
              }),
            );
          }
          return T.join("");
        } else if (_estColDevoir.call(this, aParams.idColonne)) {
          const lDevoir = this._getDevoir(aParams);
          const lAvecLigneCoeff = this.param.affichage.avecDevoirsCoefficient
            ? _existeDevoirSansCoeffParDefaut.call(this, aParams)
            : false;
          return this.moteur.composeHtmlDevoir({
            devoir: lDevoir,
            avecCorrige: this.param.avecCorrige,
            ligne: aParams.ligne,
            indiceDevoir: aParams.declarationColonne.indice,
            avecDevoirsDate: this.param.affichage.avecDevoirsDate,
            avecDevoirsCoefficient:
              this.param.affichage.avecDevoirsCoefficient && lAvecLigneCoeff,
          });
        }
      }
    }
    return "";
  }
  getVisible(D) {
    return !D.estSurMatiere;
  }
  getClass(aParams) {
    const D = aParams.article;
    const T = [];
    if (!D.estUnDeploiement) {
      if (
        [
          DonneesListe_ReleveDeNotes.colonnes.service,
          DonneesListe_ReleveDeNotes.colonnes.sousService,
        ].includes(aParams.idColonne)
      ) {
        if (
          (!D.estImprimable || !D.Actif) &&
          (D.estService ||
            aParams.idColonne !== DonneesListe_ReleveDeNotes.colonnes.service ||
            D.service.nbSousServicesActifs === 0)
        ) {
          T.push("Gris");
        }
      }
    }
    return T.join(" ");
  }
  getClassCelluleConteneur(aParams) {
    const T = [];
    if (_estColAvecGras.call(this, aParams)) {
      T.push("Gras");
    }
    if (_estColAvecAlignementDroit.call(this, aParams)) {
      T.push("AlignementDroit");
    }
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
        const lAvecCurseurInterdiction =
          !this.param.estEnConsultation &&
          !_estCellEditable.call(this, aParams);
        if (lAvecCurseurInterdiction) {
          T.push("AvecInterdiction");
        } else {
          if (
            this.moteurAssSaisie.avecAssistantSaisieActif({
              typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
            })
          ) {
            T.push("Curseur_AssistantSaisieActif");
          } else if (!this.param.estEnConsultation) {
            T.push("AvecMain");
          }
        }
        break;
      }
    }
    return T.join(" ");
  }
  getStyle(aParams) {
    let lCouleurFacultatif = null;
    if (
      _estColDevoir.call(this, aParams.idColonne) &&
      this.param.affichage.NombreMoyennesPeriodes > 0
    ) {
      const lDevoir = this._getDevoir(aParams);
      if (lDevoir) {
        lCouleurFacultatif = lDevoir.couleur;
      }
    }
    return lCouleurFacultatif
      ? "border-top:" + lCouleurFacultatif + " 0.33rem solid;"
      : "";
  }
  avecBordureDroite(aParams) {
    if (
      aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
    ) {
      return !_estCelluleDeploiement(aParams);
    }
    if (aParams && aParams.article && aParams.article.estUnDeploiement) {
      return false;
    }
    return ![DonneesListe_ReleveDeNotes.colonnes.service].includes(
      aParams.idColonne,
    );
  }
  avecBordureBas(aParams) {
    const D = aParams.article;
    if (!D.estUnDeploiement) {
      switch (aParams.idColonne) {
        case DonneesListe_ReleveDeNotes.colonnes.sousService: {
          const lService =
            !D.estService || D.estServicePereAvecSousService ? D : null;
          if (lService !== null) {
            return D.estDernier || (D.estService && !D.avecSousServiceAffiche);
          }
        }
      }
    }
    return true;
  }
  fusionCelluleAvecLignePrecedente(aParams) {
    if (
      aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
    ) {
      if (_estCelluleDeploiement(aParams.celluleLignePrecedente)) {
        return false;
      }
      return !aParams.article.estUnDeploiement && aParams.article.regroupement;
    }
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.service:
        return (
          !aParams.article.estService &&
          !aParams.article.estPremier &&
          !aParams.article.estUnDeploiement
        );
      case DonneesListe_ReleveDeNotes.colonnes.appreciation:
        return (
          !aParams.article.estUnDeploiement &&
          !aParams.article.avecAppreciationParSousService &&
          !aParams.article.estService &&
          !aParams.article.estPremier
        );
    }
    return false;
  }
  getColonneDeFusion(aParams) {
    if (
      aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
      !aParams.article.estUnDeploiement &&
      !aParams.article.regroupement
    ) {
      return DonneesListe_ReleveDeNotes.colonnes.service;
    }
  }
  getHauteurMinCellule(aParams) {
    if (
      aParams &&
      aParams.article &&
      (aParams.article.estUnDeploiement ||
        aParams.article.estServicePereAvecSousService)
    ) {
      return DonneesListe_ReleveDeNotes.dimensions.hauteurTitre;
    }
    return this.options.hauteurMinCellule;
  }
  getHintHtmlForce(aParams) {
    if (_estColDevoir.call(this, aParams.idColonne)) {
      const lDevoir = this._getDevoir(aParams);
      if (lDevoir) {
        return lDevoir.Hint;
      }
    }
  }
  getHintForce(aParams) {
    if (
      _estDonneeEditable.call(this, aParams) &&
      _estDonneeCloture.call(this, aParams)
    ) {
      return GTraductions.getValeur("PeriodeCloturee");
    }
  }
  getCouleurCellule(aParams) {
    if (
      aParams.article.estUnDeploiement ||
      (aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
        aParams.article.regroupement)
    ) {
      return ObjetDonneesListe.ECouleurCellule.Deploiement;
    }
    const I = aParams.colonne;
    const D = aParams.article;
    if (_estColFixe.call(this, aParams, I, D)) {
      return ObjetDonneesListe.ECouleurCellule.Fixe;
    }
    if (_estColCouleurTotal.call(this, aParams, I, D)) {
      return ObjetDonneesListe.ECouleurCellule.Total;
    }
    if (_estColDevoir.call(this, aParams.idColonne)) {
      return ObjetDonneesListe.ECouleurCellule.Blanc;
    }
    return null;
  }
  avecMenuContextuel() {
    return false;
  }
  avecSelection(aParams) {
    return (
      !aParams.article.estUnDeploiement &&
      aParams.idColonne !== DonneesListe_ReleveDeNotes.colonnes.regroupement
    );
  }
  avecEvenementSelection(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.devoir: {
        const lDevoir = this._getDevoir(aParams);
        if (lDevoir) {
          if (
            this.param.avecCorrige &&
            lDevoir.executionQCM &&
            lDevoir.executionQCM.publierCorrige
          ) {
            return true;
          }
        }
        return false;
      }
    }
  }
  avecEdition(aParams) {
    return _estCellEditable.call(this, aParams);
  }
  avecEvenementEdition(aParams) {
    if (
      !_estColEditable.call(this, aParams) ||
      !_estDonneeEditable.call(this, aParams)
    ) {
      return false;
    }
    if (_estDonneeCloture.call(this, aParams)) {
      return true;
    }
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.appreciation:
        return (
          _estCellEditable.call(this, aParams) &&
          this.moteurAssSaisie.avecAssistantSaisieActif({
            typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
          })
        );
    }
    return false;
  }
  autoriserChaineVideSurEdition() {
    return true;
  }
  getControleCaracteresInput(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.appreciation:
        return { tailleMax: this.param.tailleMaxAppreciation };
      default:
        return null;
    }
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
        const lData = this.moteur.getApprDeService({
          typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
          article: aParams.article,
        });
        const lService = lData.service;
        const lAppr = lData.appreciation;
        if (lAppr) {
          lAppr.setLibelle(!!V ? V.trim() : "");
          lAppr.setEtat(EGenreEtat.Modification);
          lService.setEtat(EGenreEtat.Modification);
        }
        break;
      }
    }
  }
  getContenuTotal(aParams) {
    if (this.param.moyGenerale) {
      switch (aParams.idColonne) {
        case DonneesListe_ReleveDeNotes.colonnes.service:
          return this.param.affichage.AvecSousService
            ? ""
            : GTraductions.getValeur("MoyenneGenerale");
        case DonneesListe_ReleveDeNotes.colonnes.sousService:
          return GTraductions.getValeur("MoyenneGenerale");
        case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
          return this.moteur.composeHtmlLienNoteCalculMoyenne({
            note: this.param.moyGenerale.MoyenneEleve,
            ligne: aParams.ligne,
            colonne: aParams.colonne,
            idColonne: aParams.idColonne,
          });
        case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
          return this.param.moyGenerale.MoyenneClasse;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
          return this.param.moyGenerale.MoyenneMediane;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
          return this.param.moyGenerale.MoyenneInf;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
          return this.param.moyGenerale.MoyenneSup;
        case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
          return this.moteur.composeHtmlLienNoteCalculMoyenne({
            note: this.param.moyGenerale.MoyenneAnnuelle,
            ligne: aParams.ligne,
            colonne: aParams.colonne,
            idColonne: aParams.idColonne,
          });
        default:
          if (_estColMoyPeriode.call(this, aParams.idColonne)) {
            const lNumero = aParams.declarationColonne.numeroPeriode;
            const lMoy =
              this.param.moyGenerale.ListeMoyennesPeriodes &&
              this.param.moyGenerale.ListeMoyennesPeriodes.count()
                ? this.param.moyGenerale.ListeMoyennesPeriodes.getElementParNumero(
                    lNumero,
                  ).MoyennePeriode
                : null;
            return lMoy
              ? this.moteur.composeHtmlLienNoteCalculMoyenne({
                  note: lMoy,
                  ligne: aParams.ligne,
                  colonne: aParams.colonne,
                  idColonne: aParams.idColonne,
                })
              : "";
          }
          return "";
      }
    }
  }
  getTypeCelluleTotal(aParams) {
    if (this.param.moyGenerale) {
      switch (aParams.idColonne) {
        case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
        case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
        case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
        case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
        case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
        case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
          return ObjetDonneesListe.typeCelluleTotal.defaut;
        default:
          if (_estColMoyPeriode.call(this, aParams.idColonne)) {
            return ObjetDonneesListe.typeCelluleTotal.defaut;
          }
          return ObjetDonneesListe.typeCelluleTotal.fond;
      }
    }
    return ObjetDonneesListe.typeCelluleTotal.fond;
  }
  getClassTotal(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.service:
      case DonneesListe_ReleveDeNotes.colonnes.sousService:
        return "AlignementDroit";
      default:
        return "AlignementDroit Gras";
    }
  }
  getColonneDeFusionTotal(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReleveDeNotes.colonnes.service:
        return DonneesListe_ReleveDeNotes.colonnes.sousService;
    }
    return null;
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
    );
  }
  getPadding(aParams) {
    if (
      aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
    ) {
      return 4;
    }
  }
  initOptions(aInstance, aParam) {
    aInstance.setOptionsListe({
      colonnes: this.getColonnesOrdonneesSelonContexte(aParam),
      scrollHorizontal: true,
      avecLigneTotal: aParam.affichage.AvecMoyenneGenerale,
      colonnesTriables: false,
      hauteurAdapteContenu: true,
      avecModeAccessible: true,
      nonEditableSurModeExclusif: true,
    });
  }
  getColonnesOrdonneesSelonContexte(aParam) {
    const lDimensions = DonneesListe_ReleveDeNotes.dimensions;
    const lAffichage = aParam.affichage;
    const lColonnes = [];
    let lIdCol;
    lColonnes.push({
      id: DonneesListe_ReleveDeNotes.colonnes.regroupement,
      taille: lDimensions.largeurRegroupement,
      titre: GTraductions.getValeur("Matieres"),
    });
    lColonnes.push({
      id: DonneesListe_ReleveDeNotes.colonnes.service,
      taille: lDimensions.largeurService,
      titre: {
        libelle: GTraductions.getValeur("Matieres"),
        avecFusionColonne: true,
      },
    });
    if (lAffichage.AvecSousService) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.sousService,
        taille: lDimensions.largeurSousService,
        titre: {
          libelle: GTraductions.getValeur("Matieres"),
          avecFusionColonne: true,
        },
      });
    }
    if (lAffichage.AvecVolumeHoraire) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.volumeHoraire,
        taille: lDimensions.largeurDevoir,
        titre: GTraductions.getValeur("BulletinEtReleve.VolH"),
        hint: GTraductions.getValeur("BulletinEtReleve.HintVolH"),
      });
    }
    if (lAffichage.AvecCoefficient) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.coefficient,
        taille: lDimensions.largeurNote,
        titre: GTraductions.getValeur("BulletinEtReleve.Coeff"),
        hint: GTraductions.getValeur("BulletinEtReleve.HintCoeff"),
      });
    }
    const lNbrMoy =
      Number(lAffichage.AvecMoyenneEleve) +
      Number(lAffichage.AvecMoyenneClasse) +
      Number(lAffichage.AvecMoyenneAnnuelle) +
      lAffichage.NombreMoyennesPeriodes +
      2 * Number(lAffichage.AvecMoyenneInfSup);
    const lLibelleMoy = _getLibelleMoyennes.call(this, {
      nbrMoy: lNbrMoy,
      affichage: lAffichage,
    });
    if (lAffichage.AvecNivMaitriseEleve && lAffichage.AvecMoyenneEleve) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: GTraductions.getValeur("Eleve"), avecFusionColonne: true },
          { libelle: GTraductions.getValeur("BulletinEtReleve.Pos") },
        ],
      });
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: GTraductions.getValeur("Eleve"), avecFusionColonne: true },
          { libelle: lLibelleMoy },
        ],
      });
    } else if (lAffichage.AvecMoyenneEleve) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: lLibelleMoy, avecFusionColonne: true },
          { libelle: GTraductions.getValeur("Eleve") },
        ],
      });
    } else if (lAffichage.AvecNivMaitriseEleve) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve,
        taille: lDimensions.largeurNote,
        titre: { libelle: GTraductions.getValeur("BulletinEtReleve.Pos") },
      });
    }
    if (lAffichage.AvecMoyenneAnnuelle) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: GTraductions.getValeur("Eleve"), avecFusionColonne: true },
          { libelle: GTraductions.getValeur("Annee") },
        ],
      });
    }
    for (let i = 0; i < lAffichage.NombreMoyennesPeriodes; i++) {
      lIdCol = _getIdColMoyPeriode.call(this, i);
      const lPeriode = lAffichage.listePeriodes.get(i);
      const lCouleurPeriode =
        lAffichage.listeLibellesPeriodes.getElementParNumero(
          lPeriode.getNumero(),
        ).couleur;
      const lHtmlCouleurPeriode = !!lCouleurPeriode
        ? '<div class="couleur-periode" style="background-color:' +
          lCouleurPeriode +
          ';"></div>'
        : "";
      lColonnes.push({
        id: lIdCol,
        numeroPeriode: lPeriode.getNumero(),
        indice: i,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: GTraductions.getValeur("Eleve"), avecFusionColonne: true },
          {
            libelleHtml:
              '<div class="titre-periode">' +
              lHtmlCouleurPeriode +
              "<div>" +
              lPeriode.getLibelle() +
              "</div></div>",
          },
        ],
      });
    }
    if (lAffichage.AvecMoyenneClasse) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: lLibelleMoy, avecFusionColonne: true },
          {
            libelle: lAffichage.AvecMoyenneAnnuelle
              ? GTraductions.getValeur("BulletinEtReleve.Moy")
              : GTraductions.getValeur("Classe"),
          },
        ],
      });
    }
    if (lAffichage.AvecMoyenneInfSup) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: lLibelleMoy, avecFusionColonne: true },
          { libelle: "-" },
        ],
      });
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: lLibelleMoy, avecFusionColonne: true },
          { libelle: "+" },
        ],
      });
    }
    if (lAffichage.AvecMoyenneMediane) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
        taille: lDimensions.largeurNote,
        titre: [
          { libelle: lLibelleMoy, avecFusionColonne: true },
          { libelle: GTraductions.getValeur("BulletinEtReleve.Mediane") },
        ],
      });
    }
    if (lAffichage.AvecDureeDesAbsenses) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees,
        taille: lDimensions.largeurDevoir,
        titre: GTraductions.getValeur("BulletinEtReleve.HeuresCoursManquees"),
        hint: GTraductions.getValeur(
          "BulletinEtReleve.HintHeuresCoursManquees",
        ),
      });
    }
    for (let i = 0; i < this.Donnees.nbrMaxTotDevoirs; i++) {
      lIdCol = _getIdColDevoir.call(this, i);
      lColonnes.push({
        id: lIdCol,
        indice: i,
        taille: lDimensions.largeurDevoir,
        titre: {
          libelle: GTraductions.getValeur("Devoirs"),
          avecFusionColonne: true,
        },
      });
    }
    if (lAffichage.NombreAppreciations) {
      lColonnes.push({
        id: DonneesListe_ReleveDeNotes.colonnes.appreciation,
        taille: ObjetListe.initColonne(
          100,
          lDimensions.largeurMinAppr,
          lDimensions.largeurMaxAppr,
        ),
        titre: { libelle: GTraductions.getValeur("Appreciation") },
      });
    }
    return lColonnes;
  }
}
DonneesListe_ReleveDeNotes.colonnes = {
  regroupement: "ReleveNotes_regroupement",
  service: "ReleveNotes_service",
  sousService: "ReleveNotes_sous_service",
  moyenneEleve: "ReleveNotes_moyenne_eleve",
  moyenneAnnuelle: "ReleveNotes_moyenne_annuelle",
  moyennePeriode: "ReleveNotes_moyenne_periode",
  moyenneClasse: "ReleveNotes_moyenne_classe",
  moyenneMediane: "ReleveNotes_moyenne_mediane",
  moyenneInf: "ReleveNotes_moyenne_inferieure",
  moyenneSup: "ReleveNotes_moyenne_superieure",
  devoir: "ReleveNotes_devoir",
  appreciation: "ReleveNotes_appreciation",
  nivMaitriseEleve: "ReleveNotes_nivMaitriseEleve",
  coefficient: "ReleveNotes_coefficient",
  volumeHoraire: "ReleveNotes_volumeHoraire",
  heureCoursManquees: "ReleveNotes_heureCoursManquees",
};
DonneesListe_ReleveDeNotes.dimensions = {
  largeurRegroupement: 4,
  largeurService: 175,
  largeurSousService: 100,
  largeurNote: 50,
  largeurDevoir: 72,
  largeurMinAppr: 160,
  largeurMaxAppr: 400,
  hauteurTitre: 20,
  hauteurService: 35,
  nbMaxProfs: 3,
};
function _estColMoyPeriode(aIdCol) {
  return this.moteurGrille.estColVariable(
    aIdCol,
    DonneesListe_ReleveDeNotes.colonnes.moyennePeriode,
  );
}
function _getIdColMoyPeriode(aIndice) {
  return this.moteurGrille.getIdColVariable(
    aIndice,
    DonneesListe_ReleveDeNotes.colonnes.moyennePeriode,
  );
}
function _estColDevoir(aIdCol) {
  return this.moteurGrille.estColVariable(
    aIdCol,
    DonneesListe_ReleveDeNotes.colonnes.devoir,
  );
}
function _getIdColDevoir(aIndice) {
  return this.moteurGrille.getIdColVariable(
    aIndice,
    DonneesListe_ReleveDeNotes.colonnes.devoir,
  );
}
function _existeDevoirSansCoeffParDefaut(aParams) {
  let lResult = false;
  if (aParams.article.ListeDevoirs) {
    aParams.article.ListeDevoirs.parcourir((aDevoir) => {
      if (lResult !== true) {
        lResult =
          aDevoir.Coefficient && !aDevoir.Coefficient.estCoefficientParDefaut();
      }
    });
  }
  return lResult;
}
function _getMoyenne(I, D, aParams) {
  switch (aParams.idColonne) {
    case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
      return D.MoyenneEleve;
    case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
      return D.MoyenneClasse;
    case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
      return D.MoyenneMediane;
    case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
      return D.MoyenneAnnuelle;
    case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
      return D.MoyenneInf;
    case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
      return D.MoyenneSup;
    default: {
      if (_estColMoyPeriode.call(this, aParams.idColonne)) {
        return this._getPeriode(aParams);
      }
    }
  }
  return null;
}
function _estColAvecGras(aParams) {
  return (
    [
      DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
      DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
      DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
      DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
      DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
      DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
    ].includes(aParams.idColonne) ||
    _estColMoyPeriode.call(this, aParams.idColonne)
  );
}
function _estColAvecAlignementDroit(aParams) {
  return (
    [
      DonneesListe_ReleveDeNotes.colonnes.sousService,
      DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
      DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
      DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
      DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
      DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
      DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
      DonneesListe_ReleveDeNotes.colonnes.volumeHoraire,
      DonneesListe_ReleveDeNotes.colonnes.coefficient,
      DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees,
    ].includes(aParams.idColonne) ||
    _estColMoyPeriode.call(this, aParams.idColonne)
  );
}
function _estCelluleDeploiement(aParams) {
  return (
    aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
    aParams.article.estUnDeploiement === true
  );
}
function _estColFixe(aParams) {
  const lTabColFixe = [
    DonneesListe_ReleveDeNotes.colonnes.service,
    DonneesListe_ReleveDeNotes.colonnes.sousService,
  ];
  return lTabColFixe.includes(aParams.idColonne);
}
function _estColCouleurTotal(aParams) {
  const lTabCol = [
    DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve,
    DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
    DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
    DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
    DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
    DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
    DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
  ];
  return (
    lTabCol.includes(aParams.idColonne) ||
    _estColMoyPeriode.call(this, aParams.idColonne)
  );
}
function _estColEditable(aParams) {
  const lTabColEditable = [DonneesListe_ReleveDeNotes.colonnes.appreciation];
  if (lTabColEditable.includes(aParams.idColonne)) {
    return true;
  }
  return false;
}
function _estDonneeEditable(aParams) {
  if (!_estColEditable.call(this, aParams)) {
    return false;
  }
  switch (aParams.idColonne) {
    case DonneesListe_ReleveDeNotes.colonnes.appreciation:
      return this.param.saisie && aParams.article.Editable;
    default:
      return false;
  }
}
function _estDonneeCloture(aParams) {
  return aParams.article.Cloture;
}
function _estCellEditable(aParams) {
  const lEditable = _estDonneeEditable.call(this, aParams);
  const lCloture = _estDonneeCloture.call(this, aParams);
  const lServicePereAvecAppreciationParSousService =
    aParams.article.estServicePereAvecSousService &&
    aParams.article.avecAppreciationParSousService;
  return lEditable && !lCloture && !lServicePereAvecAppreciationParSousService;
}
function _getLibelleMoyennes(aParam) {
  let lLibelleMoyennes;
  if (aParam.affichage.AvecMoyenneAnnuelle) {
    lLibelleMoyennes = GTraductions.getValeur("Classe");
  } else {
    lLibelleMoyennes =
      aParam.nbrMoy === 1
        ? GTraductions.getValeur("BulletinEtReleve.Moy")
        : GTraductions.getValeur("Moyennes");
  }
  return lLibelleMoyennes;
}
module.exports = { DonneesListe_ReleveDeNotes };
