const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
  EGenreNiveauDAcquisition,
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const {
  TypeGenreElementBulletinCompetence,
} = require("TypeGenreElementBulletinCompetence.js");
const {
  TypeJaugeEvaluationBulletinCompetence,
} = require("TypeJaugeEvaluationBulletinCompetence.js");
const { TypePositionnement } = require("TypePositionnement.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_BulletinCompetences extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    let lAvecAuMoinsUnNiveauAbsent = false;
    let lAvecAuMoinsUnNiveauDispense = false;
    let lAvecAuMoinsUnNiveauNonEvalue = false;
    let lRegroupement = null;
    if (aDonnees) {
      aDonnees.parcourir((D) => {
        if (
          !!D.listeNiveaux &&
          !(
            lAvecAuMoinsUnNiveauAbsent &&
            lAvecAuMoinsUnNiveauDispense &&
            lAvecAuMoinsUnNiveauNonEvalue
          )
        ) {
          D.listeNiveaux.parcourir((aNiveau) => {
            if (
              aNiveau.getGenre() === EGenreNiveauDAcquisition.Absent &&
              !!aNiveau.nbr
            ) {
              lAvecAuMoinsUnNiveauAbsent = true;
            }
            if (
              aNiveau.getGenre() === EGenreNiveauDAcquisition.Dispense &&
              !!aNiveau.nbr
            ) {
              lAvecAuMoinsUnNiveauDispense = true;
            } else if (
              aNiveau.getGenre() === EGenreNiveauDAcquisition.NonEvalue &&
              !!aNiveau.nbr
            ) {
              lAvecAuMoinsUnNiveauNonEvalue = true;
            }
          });
        }
        if (
          D.getGenre() === TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
        ) {
          D.estUnDeploiement = true;
          D.estDeploye = true;
          lRegroupement = D;
        } else {
          if (
            [
              TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
              TypeGenreElementBulletinCompetence.tEBPM_Competence,
              TypeGenreElementBulletinCompetence.tEBPM_SousItem,
            ].includes(D.getGenre()) ||
            (D.getGenre() ===
              TypeGenreElementBulletinCompetence.tEBPM_Service &&
              D.estDansRegroupement)
          ) {
            D.pere = lRegroupement;
          } else {
            lRegroupement = null;
          }
        }
      });
    }
    super(aDonnees);
    this.avecAuMoinsUnNiveauAbsent = lAvecAuMoinsUnNiveauAbsent;
    this.avecAuMoinsUnNiveauDispense = lAvecAuMoinsUnNiveauDispense;
    this.avecAuMoinsUnNiveauNonEvalue = lAvecAuMoinsUnNiveauNonEvalue;
    this.maquette = aParams.maquette;
    this.typePositionnementSansNote =
      aParams.typePositionnementSansNote || TypePositionnement.POS_Echelle;
    this.estJaugeEvaluationsCliquable = aParams.estJaugeEvaluationsCliquable;
    this.avecAssistantSaisie = aParams.avecAssistantSaisie || false;
    this.tailleMaxAppreciation = aParams.tailleMaxAppr || 0;
    this.avecAppreciationsSurRegroupement =
      aParams.avecAppreciationsSurRegroupement;
    this.donneesLigneTotal = aParams.donneesLigneTotal;
    this.setOptions({
      editionApresSelection: false,
      avecDeploiement: true,
      avecSuppression: false,
      avecEvnt_ApresEdition: true,
    });
  }
  _estJaugeChronologique() {
    return (
      this.maquette.genreJauge ===
      TypeJaugeEvaluationBulletinCompetence.tJBC_Chronologique
    );
  }
  static estUneColonneTransversale(aIdColonne) {
    return aIdColonne.startsWith(
      DonneesListe_BulletinCompetences.colonnes.prefixe_col_transv,
    );
  }
  static getObjetElementColonneTransversale(aArticle, aParams) {
    let result;
    if (!!aArticle && !!aArticle.listeColonnesTransv) {
      const lIndex = aParams.declarationColonne.indexColonneTransv;
      if (lIndex > -1) {
        result = aArticle.listeColonnesTransv.get(lIndex);
      }
    }
    return result;
  }
  getClass(aParams) {
    if (
      DonneesListe_BulletinCompetences.estUneColonneTransversale(
        aParams.idColonne,
      )
    ) {
      return "AlignementMilieu";
    }
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.service: {
        const lResult = [];
        if (
          aParams.article.getGenre() ===
          TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
        ) {
          lResult.push("Gras");
        }
        if (!aParams.article.imprimable) {
          lResult.push("Gris");
        }
        return lResult.join(" ");
      }
      case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
      case DonneesListe_BulletinCompetences.colonnes.pourcentage:
      case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
      case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
      case DonneesListe_BulletinCompetences.colonnes.posLSU:
      case DonneesListe_BulletinCompetences.colonnes.note:
      case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
      case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
      case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
        return "AlignementMilieu";
    }
    return "";
  }
  getClassCelluleConteneur(aParams) {
    if (_estCelluleDeploiement(aParams)) {
      return "AvecMain";
    }
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.jauge:
        if (this.estJaugeEvaluationsCliquable) {
          if (
            !!aParams.article.relationsESI &&
            aParams.article.relationsESI.length > 0
          ) {
            return "AvecMain";
          }
        }
        return "";
      case DonneesListe_BulletinCompetences.colonnes.note:
        return this.avecEdition(aParams) ? "AvecMain" : "";
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
        let lClasseAppreciation = "";
        if (estAppreciationEditable(aParams.idColonne, aParams.article)) {
          if (
            this.avecAssistantSaisie &&
            GEtatUtilisateur.assistantSaisieActif
          ) {
            lClasseAppreciation = "Curseur_AssistantSaisieActif";
          } else {
            lClasseAppreciation = "AvecMain";
          }
        }
        return lClasseAppreciation;
      }
    }
    return "";
  }
  avecContenuTronque(aParams) {
    return (
      aParams.idColonne === DonneesListe_BulletinCompetences.colonnes.competence
    );
  }
  getTypeValeur(aParams) {
    if (estUneColonneAppreciation(aParams.idColonne)) {
      return ObjetDonneesListe.ETypeCellule.ZoneTexte;
    } else {
      switch (aParams.idColonne) {
        case DonneesListe_BulletinCompetences.colonnes.regroupement:
          return aParams.article.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
            ? ObjetDonneesListe.ETypeCellule.CocheDeploiement
            : ObjetDonneesListe.ETypeCellule.Html;
        case DonneesListe_BulletinCompetences.colonnes.service:
          return ObjetDonneesListe.ETypeCellule.Html;
        case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
          return ObjetDonneesListe.ETypeCellule.Html;
        case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
        case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
        case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
        case DonneesListe_BulletinCompetences.colonnes.posLSU:
          return ObjetDonneesListe.ETypeCellule.Html;
        case DonneesListe_BulletinCompetences.colonnes.note:
        case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
        case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
        case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
          return ObjetDonneesListe.ETypeCellule.Note;
      }
    }
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_BulletinCompetences.colonnes.regroupement
    );
  }
  avecMenuContextuel() {
    return false;
  }
  getPadding(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_BulletinCompetences.colonnes.regroupement
    ) {
      return 0;
    }
  }
  getCouleurCellule(aParams) {
    return aParams.article.getGenre() ===
      TypeGenreElementBulletinCompetence.tEBPM_SurMatiere ||
      (aParams.idColonne ===
        DonneesListe_BulletinCompetences.colonnes.regroupement &&
        aParams.article.estDansRegroupement)
      ? ObjetDonneesListe.ECouleurCellule.Deploiement
      : null;
  }
  avecBordureDroite(aParams) {
    return !_estCelluleDeploiement(aParams);
  }
  avecBordureBas(aParams) {
    return (
      !_estCelluleDeploiement(aParams) ||
      !aParams.celluleLigneSuivante ||
      !aParams.celluleLigneSuivante.article.pere
    );
  }
  getColonneDeFusion(aParams) {
    if (
      aParams.idColonne !==
        DonneesListe_BulletinCompetences.colonnes.regroupement &&
      aParams.article.getGenre() ===
        TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
    ) {
      return DonneesListe_BulletinCompetences.colonnes.service;
    }
    if (
      aParams.idColonne ===
        DonneesListe_BulletinCompetences.colonnes.regroupement &&
      aParams.article.getGenre() !==
        TypeGenreElementBulletinCompetence.tEBPM_SurMatiere &&
      !aParams.article.estDansRegroupement
    ) {
      return DonneesListe_BulletinCompetences.colonnes.service;
    }
  }
  fusionCelluleAvecLignePrecedente(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.regroupement:
        if (_estCelluleDeploiement(aParams.celluleLignePrecedente)) {
          return false;
        }
        return (
          [
            TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
            TypeGenreElementBulletinCompetence.tEBPM_Competence,
            TypeGenreElementBulletinCompetence.tEBPM_SousItem,
          ].includes(aParams.article.getGenre()) ||
          (aParams.article.getGenre() ===
            TypeGenreElementBulletinCompetence.tEBPM_Service &&
            aParams.article.estDansRegroupement)
        );
      case DonneesListe_BulletinCompetences.colonnes.service:
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
      case DonneesListe_BulletinCompetences.colonnes.pourcentage:
      case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
      case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
      case DonneesListe_BulletinCompetences.colonnes.posLSU:
      case DonneesListe_BulletinCompetences.colonnes.note:
      case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
      case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
      case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
        let lAvecFusionLigne;
        if (
          estUneColonneAppreciation(aParams.idColonne) &&
          this.avecAppreciationsSurRegroupement &&
          aParams.article.estDansRegroupement
        ) {
          const lCellulePrecedente = aParams.celluleLignePrecedente;
          lAvecFusionLigne =
            lCellulePrecedente &&
            lCellulePrecedente.article &&
            !lCellulePrecedente.article.estUnDeploiement;
        } else {
          lAvecFusionLigne = [
            TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
            TypeGenreElementBulletinCompetence.tEBPM_Competence,
            TypeGenreElementBulletinCompetence.tEBPM_SousItem,
          ].includes(aParams.article.getGenre());
        }
        return lAvecFusionLigne;
      }
    }
    return false;
  }
  avecSelection(aParams) {
    return (
      aParams.article.getGenre() !==
        TypeGenreElementBulletinCompetence.tEBPM_SurMatiere &&
      (aParams.idColonne !==
        DonneesListe_BulletinCompetences.colonnes.regroupement ||
        !aParams.article.pere)
    );
  }
  avecEvenementSelectionClick() {
    return true;
  }
  avecEdition(aParams) {
    if (
      DonneesListe_BulletinCompetences.estUneColonneTransversale(
        aParams.idColonne,
      )
    ) {
      const lObjetElementColonneTransv =
        DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
          aParams.article,
          aParams,
        );
      return lObjetElementColonneTransv
        ? lObjetElementColonneTransv.editable
        : false;
    } else if (estUneColonneAppreciation(aParams.idColonne)) {
      return estAppreciationEditable(aParams.idColonne, aParams.article);
    }
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
        return aParams.article.niveauAcqCompEditable;
      case DonneesListe_BulletinCompetences.colonnes.posLSU:
        return aParams.article.posNiveauEditable;
      case DonneesListe_BulletinCompetences.colonnes.note:
        return aParams.article.posNoteEditable;
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
        return aParams.article.eltProgEditable;
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    if (
      DonneesListe_BulletinCompetences.estUneColonneTransversale(
        aParams.idColonne,
      )
    ) {
      return this.avecEdition(aParams);
    }
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
        return aParams.article.niveauAcqCompEditable;
      case DonneesListe_BulletinCompetences.colonnes.posLSU:
        return aParams.article.posNiveauEditable;
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
        return aParams.article.eltProgEditable;
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
        let lAvecEventEdition = false;
        if (this.avecAssistantSaisie && GEtatUtilisateur.assistantSaisieActif) {
          lAvecEventEdition = estAppreciationEditable(
            aParams.idColonne,
            aParams.article,
          );
        }
        return lAvecEventEdition;
      }
    }
    return false;
  }
  avecEtatSaisie(aParamsCellule) {
    return (
      !estUneColonneAppreciation(aParamsCellule.idColonne) &&
      !(
        aParamsCellule.idColonne ===
        DonneesListe_BulletinCompetences.colonnes.note
      )
    );
  }
  autoriserChaineVideSurEdition() {
    return true;
  }
  getControleCaracteresInput(aParams) {
    if (estUneColonneAppreciation(aParams.idColonne)) {
      return { tailleMax: this.tailleMaxAppreciation };
    }
    return null;
  }
  getOptionsNote() {
    return {
      sansNotePossible: true,
      afficherAvecVirgule: true,
      hintSurErreur: false,
      min: 0,
      max: 20,
      listeAnnotations: [
        EGenreAnnotation.absent,
        EGenreAnnotation.dispense,
        EGenreAnnotation.nonNote,
      ],
    };
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.note:
        aParams.article.posLSUNoteModif = aParams.valeur;
        aParams.article.setEtat(EGenreEtat.Modification);
        break;
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
        aParams.article.appreciationA = V ? V.trim() : "";
        break;
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
        aParams.article.appreciationB = V ? V.trim() : "";
        break;
      case DonneesListe_BulletinCompetences.colonnes.appreciationC:
        aParams.article.appreciationC = V ? V.trim() : "";
        break;
    }
  }
  getValeur(aParams) {
    if (
      DonneesListe_BulletinCompetences.estUneColonneTransversale(
        aParams.idColonne,
      )
    ) {
      const lObjetElementColonneTransv =
        DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
          aParams.article,
          aParams,
        );
      if (!!lObjetElementColonneTransv) {
        const lExisteUnNiveauAcqui = !!lObjetElementColonneTransv.niveauAcqui;
        const lAUnNiveauAcquiSaisi =
          lExisteUnNiveauAcqui &&
          lObjetElementColonneTransv.niveauAcqui.existeNumero();
        const lAUnNiveauAcquiCalcule =
          !!lObjetElementColonneTransv.niveauAcquiCalc &&
          lObjetElementColonneTransv.niveauAcquiCalc.existeNumero();
        const H = [];
        if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
          if (lAUnNiveauAcquiSaisi) {
            H.push(
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcqui,
                { avecTitle: false },
              ),
            );
          } else {
            H.push('<div style="width:16px;" class="InlineBlock">&nbsp;</div>');
          }
          H.push(
            " (",
            EGenreNiveauDAcquisitionUtil.getImage(
              lObjetElementColonneTransv.niveauAcquiCalc,
              { avecTitle: false },
            ),
            ")",
          );
        } else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
          if (lAUnNiveauAcquiSaisi) {
            H.push(
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcqui,
                { avecTitle: false },
              ),
            );
          } else {
            H.push(
              EGenreNiveauDAcquisitionUtil.getImage(
                lObjetElementColonneTransv.niveauAcquiCalc,
                { avecTitle: false },
              ),
            );
          }
        }
        return H.join("");
      }
    }
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.service:
        return aParams.article.strServiceEtProf || "";
      case DonneesListe_BulletinCompetences.colonnes.competence:
        return aParams.article.strElmtCompetence || "";
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
        return aParams.article.strEltProg || "";
      case DonneesListe_BulletinCompetences.colonnes.jauge: {
        let lJauge = "";
        if (this._estJaugeChronologique()) {
          lJauge = TUtilitaireCompetences.composeJaugeChronologique({
            listeNiveaux: aParams.article.listeNiveauxChronologique,
            hint: aParams.article.hintNiveaux,
          });
        } else {
          const lOptionsJauge = {
            listeNiveaux: aParams.article.listeNiveaux,
            hint: aParams.article.hintNiveaux,
          };
          lOptionsJauge.listeGenreNiveauxIgnores = [];
          if (this.avecAuMoinsUnNiveauAbsent === false) {
            lOptionsJauge.listeGenreNiveauxIgnores.push(
              EGenreNiveauDAcquisition.Absent,
            );
          }
          if (this.avecAuMoinsUnNiveauDispense === false) {
            lOptionsJauge.listeGenreNiveauxIgnores.push(
              EGenreNiveauDAcquisition.Dispense,
            );
          }
          if (this.avecAuMoinsUnNiveauNonEvalue === false) {
            lOptionsJauge.listeGenreNiveauxIgnores.push(
              EGenreNiveauDAcquisition.NonEvalue,
            );
          }
          if (
            [
              TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
              TypeGenreElementBulletinCompetence.tEBPM_Competence,
              TypeGenreElementBulletinCompetence.tEBPM_SousItem,
            ].includes(aParams.article.getGenre())
          ) {
            lJauge =
              TUtilitaireCompetences.composeJaugeParPastilles(lOptionsJauge);
          } else {
            lJauge =
              TUtilitaireCompetences.composeJaugeParNiveaux(lOptionsJauge);
          }
        }
        return lJauge;
      }
      case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
        return aParams.article.niveauAcqComp
          ? EGenreNiveauDAcquisitionUtil.getImage(aParams.article.niveauAcqComp)
          : "";
      case DonneesListe_BulletinCompetences.colonnes.pourcentage:
        return aParams.article.pourcentage ? aParams.article.pourcentage : "";
      case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
        return !!aParams.article.posLSUNiveauP1
          ? EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: aParams.article.posLSUNiveauP1,
              genrePositionnement: this.typePositionnementSansNote,
            })
          : "";
      case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
        return !!aParams.article.posLSUNiveauP2
          ? EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: aParams.article.posLSUNiveauP2,
              genrePositionnement: this.typePositionnementSansNote,
            })
          : "";
      case DonneesListe_BulletinCompetences.colonnes.posLSU:
        return !!aParams.article.posLSUNiveau
          ? EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: aParams.article.posLSUNiveau,
              genrePositionnement: this.typePositionnementSansNote,
            })
          : "";
      case DonneesListe_BulletinCompetences.colonnes.note:
        return aParams.article.posLSUNote;
      case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
        return aParams.article.moyenneClasse || "";
      case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
        return aParams.article.moyenneInf || "";
      case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
        return aParams.article.moyenneSup || "";
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
        return aParams.article.appreciationA || "";
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
        return aParams.article.appreciationB || "";
      case DonneesListe_BulletinCompetences.colonnes.appreciationC:
        return aParams.article.appreciationC || "";
    }
    return "";
  }
  getContenuTotal(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.service:
        return GTraductions.getValeur("competences.MoyenneGenerale");
      case DonneesListe_BulletinCompetences.colonnes.note:
        return !!this.donneesLigneTotal
          ? this.donneesLigneTotal.moyEleve || ""
          : "";
      case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
        return !!this.donneesLigneTotal
          ? this.donneesLigneTotal.moyClasse || ""
          : "";
      case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
        return !!this.donneesLigneTotal
          ? this.donneesLigneTotal.moyInf || ""
          : "";
      case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
        return !!this.donneesLigneTotal
          ? this.donneesLigneTotal.moySup || ""
          : "";
    }
    return "";
  }
  getClassTotal(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.service:
        lClasses.push("Gras");
        lClasses.push("AlignementDroit");
        break;
      case DonneesListe_BulletinCompetences.colonnes.note:
      case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join(" ");
  }
  getColonneDeFusionTotal(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_BulletinCompetences.colonnes.regroupement
    ) {
      return DonneesListe_BulletinCompetences.colonnes.service;
    }
    return null;
  }
  getHintForce(aParams) {
    if (
      DonneesListe_BulletinCompetences.estUneColonneTransversale(
        aParams.idColonne,
      )
    ) {
      const lObjetElementColonneTransv =
        DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
          aParams.article,
          aParams,
        );
      if (!!lObjetElementColonneTransv) {
        let lHint;
        if (GEtatUtilisateur.estEspacePourEleve()) {
          const lNiveau = lObjetElementColonneTransv.niveauAcqui;
          lHint = EGenreNiveauDAcquisitionUtil.getLibelle(lNiveau);
        } else {
          lHint = lObjetElementColonneTransv.hint;
        }
        return lHint || "";
      }
    } else {
      switch (aParams.idColonne) {
        case DonneesListe_BulletinCompetences.colonnes.competence:
          return aParams.article.strElmtCompetence || "";
      }
    }
  }
  getHintHtmlForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
        return aParams.article.hintEltProg || "";
    }
    return "";
  }
}
DonneesListe_BulletinCompetences.colonnes = {
  regroupement: "regroupement",
  service: "service",
  competence: "competence",
  elementsProgramme: "elementsProgramme",
  jauge: "jauge",
  niveauAcqComp: "niveauAcqComp",
  pourcentage: "pourcentage",
  posLSUP1: "posLSUP1",
  posLSUP2: "posLSUP2",
  posLSU: "posLSU",
  note: "note",
  moyenneClasse: "moyenneClasse",
  moyenneInf: "moyenneInf",
  moyenneSup: "moyenneSup",
  appreciationA: "appreciationA",
  appreciationB: "appreciationB",
  appreciationC: "appreciationC",
  prefixe_col_transv: "transversal_",
};
function _estCelluleDeploiement(aParams) {
  return (
    aParams.idColonne ===
      DonneesListe_BulletinCompetences.colonnes.regroupement &&
    aParams.article.getGenre() ===
      TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
  );
}
function estAppreciationEditable(aIdColonne, aArticle) {
  return (
    (aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationA &&
      aArticle.appAEditable) ||
    (aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationB &&
      aArticle.appBEditable) ||
    (aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationC &&
      aArticle.appCEditable)
  );
}
function estUneColonneAppreciation(aIdColonne) {
  return [
    DonneesListe_BulletinCompetences.colonnes.appreciationA,
    DonneesListe_BulletinCompetences.colonnes.appreciationB,
    DonneesListe_BulletinCompetences.colonnes.appreciationC,
  ].includes(aIdColonne);
}
module.exports = { DonneesListe_BulletinCompetences };
