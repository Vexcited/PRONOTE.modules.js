const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GStyle } = require("ObjetStyle.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const {
  EGenreRessource,
  EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const {
  TypeRessourceAbsence,
  TypeRessourceAbsenceUtil,
} = require("TypeRessourceAbsence.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { TypeNote } = require("TypeNote.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreMedia, EGenreMediaUtil } = require("Enumere_Media.js");
const { GDate } = require("ObjetDate.js");
class DonneesListe_SuiviJustificationsAbsRetards extends ObjetDonneesListe {
  constructor(aDonnees, aParametres) {
    super(aDonnees);
    this.callbackAjoutDocumentJoint = aParametres.callbackAjoutDocumentJoint;
    this.callbackRemplacerDocumentJoint =
      aParametres.callbackRemplacerDocumentJoint;
    this.callbackSuppressionDocumentJoint =
      aParametres.callbackSuppressionDocumentJoint;
    this.listeFiltreTypeRessAbsences = aParametres.listeFiltreTypeRessAbsences;
    this.setOptions({
      avecEvnt_Selection: true,
      avecSuppression: false,
      editionApresSelection: false,
      avecEtatSaisie: false,
    });
  }
  getControleur(aInstanceDonneesListe, aListe) {
    return $.extend(true, super.getControleur(aInstanceDonneesListe, aListe), {
      nodeDocsJointsParent: function (aligne) {
        const lArticle = aInstanceDonneesListe.Donnees.get(aligne);
        if (
          !!lArticle &&
          !!lArticle.listeDocJointsParent &&
          lArticle.listeDocJointsParent.count() > 0
        ) {
          const lDocumentJoint = lArticle.listeDocJointsParent.get(0);
          $(this.node).on("click", () => {
            ObjetMenuContextuel.afficher({
              pere: aListe,
              initCommandes: function (aMenu) {
                aMenu.add(
                  GTraductions.getValeur(
                    "SuiviJustificationAbsRet.PieceJointeConsulter",
                  ),
                  true,
                  () => {
                    _ouvrirDocumentJointParent(lDocumentJoint);
                  },
                );
                if (!!aInstanceDonneesListe.callbackRemplacerDocumentJoint) {
                  aMenu.addSelecFile(
                    GTraductions.getValeur(
                      "SuiviJustificationAbsRet.PieceJointeRemplacer",
                    ),
                    {
                      getOptionsSelecFile: function () {
                        return aInstanceDonneesListe.getOptionsSelecFile();
                      },
                      addFiles: function (aParamsInput) {
                        aInstanceDonneesListe.callbackRemplacerDocumentJoint(
                          lArticle,
                          aParamsInput.eltFichier,
                        );
                      },
                    },
                  );
                }
                aMenu.add(
                  GTraductions.getValeur(
                    "SuiviJustificationAbsRet.PieceJointeSupprimer",
                  ),
                  true,
                  () => {
                    if (
                      !!aInstanceDonneesListe.callbackSuppressionDocumentJoint
                    ) {
                      _afficherConfirmationSuppressionDocJoint(
                        lDocumentJoint,
                        () => {
                          aInstanceDonneesListe.callbackSuppressionDocumentJoint(
                            lArticle,
                          );
                        },
                      );
                    }
                  },
                );
              },
            });
          });
        }
      },
    });
  }
  avecMenuContextuel() {
    return false;
  }
  avecContenuTronque(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .commentaireParents:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee:
        return true;
    }
    return false;
  }
  getClass(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe:
        lClasses.push("Gras");
        break;
    }
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .acceptationEtablissement:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estMotifRecevable:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join(" ");
  }
  getCouleurCellule(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents
    ) {
      if (aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence) {
        return ObjetDonneesListe.ECouleurCellule.Blanc;
      }
    }
  }
  avecSelecFile(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents
    ) {
      if (aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence) {
        let lDocJointActuel = null;
        if (!!aParams.article.listeDocJointsParent) {
          lDocJointActuel = aParams.article.listeDocJointsParent.get(0);
        }
        return lDocJointActuel === null;
      }
    }
    return false;
  }
  getOptionsSelecFile() {
    return {
      maxSize: GApplication.droits.get(
        TypeDroits.tailleMaxDocJointEtablissement,
      ),
    };
  }
  evenementSurSelecFile(aParams, aParamsInput) {
    if (!!this.callbackAjoutDocumentJoint) {
      this.callbackAjoutDocumentJoint(aParams.article, aParamsInput.eltFichier);
    }
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .acceptationEtablissement:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estMotifRecevable:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estRegleAdministrativement:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi:
        return true;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin:
        return !!aParams.article.nbDemiJourneeBulletinEditable;
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin:
        return false;
    }
    return this.avecEdition(aParams);
  }
  avecEvenementApresEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin:
        return true;
    }
    return false;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin:
        aParams.article.nbDemiJourneeBulletin =
          V === null ? null : V.getValeur();
        break;
    }
  }
  getOptionsNote() {
    return {
      avecAnnotation: false,
      sansNotePossible: false,
      min: 0,
      max: 100,
      afficherAvecVirgule: true,
    };
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre: {
        const lStrImageGenre = [];
        lStrImageGenre.push(
          '<i class="',
          EGenreRessourceUtil.getNomImageAbsence(
            TypeRessourceAbsenceUtil.toGenreRessource(
              aParams.article.getGenre(),
            ),
          ),
          '"></i>',
        );
        return lStrImageGenre.join("");
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve:
        return aParams.article.eleve ? aParams.article.eleve.getLibelle() : "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe:
        return aParams.article.listeClasses
          ? aParams.article.listeClasses.getTableauLibelles().join(" / ")
          : "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime:
        return aParams.article.regime || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeRetard:
        return aParams.article.strDuree || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.date:
        return aParams.article.strDate || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
        return _getHtmlMotif(aParams.article.motif, true);
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .documentsParents: {
        const H = [];
        const lListeDJ = aParams.article.listeDocJointsParent;
        if (!!lListeDJ && lListeDJ.count() > 0) {
          H.push(
            '<span class="Image_Trombone AvecMain InlineBlock" ' +
              GHtml.composeAttr(
                "ie-node",
                "nodeDocsJointsParent",
                aParams.ligne,
              ) +
              "></span>",
          );
        }
        return H.join("");
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .raisonDonneeParents:
        return _getHtmlMotif(aParams.article.motifParent);
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .dateJustificationParents: {
        let lStrDateJustification;
        if (!!aParams.article.dateJustificationParents) {
          lStrDateJustification = GDate.formatDate(
            aParams.article.dateJustificationParents,
            "%JJ/%MM/%AAAA",
          );
        }
        return lStrDateJustification || "";
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .commentaireParents:
        return aParams.article.strCommentaireParent || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .justifieParParents:
        return aParams.article.justifiePar;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .acceptationEtablissement: {
        const lStyles = ["padding: 0.2rem 0.5rem; border: solid 1px #888;"];
        if (!!aParams.article.estMotifParentAccepte) {
          lStyles.push("background-color: ", GCouleur.vert, ";");
          lStyles.push("color: ", GCouleur.blanc, ";");
        } else {
          lStyles.push("background-color: #EEE;");
        }
        const lAcceptationEtab = [];
        lAcceptationEtab.push(
          '<span class="InlineBlock" style="',
          lStyles.join(""),
          '">',
          GTraductions.getValeur(
            "SuiviJustificationAbsRet.JustificationAcceptee",
          ),
          "</span>",
        );
        return lAcceptationEtab.join("");
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .dureeAbsenceCours:
        return aParams.article.strDureeAbsenceCours || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee:
        return aParams.article.strMatieresAffectees || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
        return !!aParams.article.estOuvert;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin: {
        let lNoteDJBulletin = null;
        if (!!aParams.article.strNbDemiJourneeBulletin && !aParams.surEdition) {
          lNoteDJBulletin = new TypeNote(
            aParams.article.strNbDemiJourneeBulletin,
          );
        } else if (
          !!aParams.article.nbDemiJourneeBulletin ||
          aParams.article.nbDemiJourneeBulletin === 0
        ) {
          lNoteDJBulletin = new TypeNote(aParams.article.nbDemiJourneeBulletin);
        }
        return lNoteDJBulletin;
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estMotifRecevable:
        return !!aParams.article.estMotifRecevable
          ? GTraductions.getValeur("SuiviJustificationAbsRet.Oui")
          : GTraductions.getValeur("SuiviJustificationAbsRet.Non");
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estRegleAdministrativement:
        return !!aParams.article.estRA;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi: {
        const lHtmlSuivi = [];
        if (!!aParams.article.suivi && !!aParams.article.suivi.nombre) {
          const lObjSuivi = aParams.article.suivi;
          lHtmlSuivi.push(
            '<span class="AlignementMilieuVertical">',
            lObjSuivi.nombre,
            "</span>",
          );
          if (lObjSuivi.genreMedia === EGenreMedia.Utilisateur) {
            if (!!lObjSuivi.code) {
              lHtmlSuivi.push(
                '<span class="MargeGauche AlignementMilieuVertical">',
                lObjSuivi.code,
                "</span>",
              );
            }
          } else if (lObjSuivi.genreMedia > 0) {
            lHtmlSuivi.push(
              '<div class="MargeGauche AlignementHaut InlineBlock ',
              EGenreMediaUtil.getNomImage(
                lObjSuivi.genreMedia,
                !lObjSuivi.estEnvoi,
              ),
              '"></div>',
            );
          }
        }
        return lHtmlSuivi.join("");
      }
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estRegleAdministrativement:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .raisonDonneeParents:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .acceptationEtablissement:
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .demiJourneesBulletin:
        return ObjetDonneesListe.ETypeCellule.Note;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre: {
        let lGenre = null;
        if (aParams.article.getGenre() === TypeRessourceAbsence.TR_Absence) {
          lGenre = TypeRessourceAbsenceUtil.getLibelle(
            TypeRessourceAbsence.TR_Absence,
          );
        } else if (
          aParams.article.getGenre() === TypeRessourceAbsence.TR_Retard
        ) {
          lGenre = TypeRessourceAbsenceUtil.getLibelle(
            TypeRessourceAbsence.TR_Retard,
          );
        }
        return lGenre || "";
      }
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents:
        return aParams.article.strDocJointsParent || "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
        return !!aParams.article.estOuvert
          ? GTraductions.getValeur(
              "SuiviJustificationAbsRet.HintAbsenceOuverte",
            )
          : "";
      case DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .estRegleAdministrativement:
        return !!aParams.article.estRA
          ? GTraductions.getValeur(
              "SuiviJustificationAbsRet.HintRegleAdministrativement",
            )
          : "";
    }
    return "";
  }
  getVisible(D) {
    if (!!D && !!this.listeFiltreTypeRessAbsences) {
      const lGenreFiltre = this.listeFiltreTypeRessAbsences.getElementParGenre(
        D.getGenre(),
      );
      return !!lGenreFiltre && !!lGenreFiltre.selectionne;
    }
    return true;
  }
  getValeurPourTri(aColonne, aArticle) {
    const lIdColonne = this.getId(aColonne);
    if (
      lIdColonne === DonneesListe_SuiviJustificationsAbsRetards.colonnes.date
    ) {
      return aArticle.date;
    } else if (
      lIdColonne ===
      DonneesListe_SuiviJustificationsAbsRetards.colonnes
        .dateJustificationParents
    ) {
      return aArticle.dateJustificationParents;
    }
    return super.getValeurPourTri(aColonne, aArticle);
  }
  getTri(aColonneTri, aGenreTri) {
    const lTris = [];
    lTris.push(
      ObjetTri.init(this.getValeurPourTri.bind(this, aColonneTri), aGenreTri),
    );
    lTris.push(
      ObjetTri.init((D) => {
        return !!D.eleve ? D.eleve.getLibelle() : "";
      }, aGenreTri),
    );
    return lTris;
  }
}
DonneesListe_SuiviJustificationsAbsRetards.colonnes = {
  genre: "DL_JustifAbsRet_genre",
  eleve: "DL_JustifAbsRet_eleve",
  classe: "DL_JustifAbsRet_classe",
  regime: "DL_JustifAbsRet_regime",
  dureeRetard: "DL_JustifAbsRet_dureeRetard",
  date: "DL_JustifAbsRet_date",
  motif: "DL_JustifAbsRet_motif",
  documentsParents: "DL_JustifAbsRet_pjParent",
  raisonDonneeParents: "DL_JustifAbsRet_raisonParent",
  dateJustificationParents: "DL_JustifAbsRet_dateJustifParent",
  commentaireParents: "DL_JustifAbsRet_commParent",
  justifieParParents: "DL_JustifAbsRet_justifieParParent",
  acceptationEtablissement: "DL_JustifAbsRet_acceptationEtab",
  dureeAbsenceCours: "DL_JustifAbsRet_dureeAbsCours",
  matieresAffectee: "DL_JustifAbsRet_matieres",
  estOuvert: "DL_JustifAbsRet_estOuvert",
  demiJourneesBulletin: "DL_JustifAbsRet_DJBulletin",
  estMotifRecevable: "DL_JustifAbsRet_estMotifRece",
  estRegleAdministrativement: "DL_JustifAbsRet_estRA",
  suivi: "DL_JustifAbsRet_suivi",
};
function _afficherConfirmationSuppressionDocJoint(aDocJoint, aSuccessCallback) {
  GApplication.getMessage()
    .afficher({
      type: EGenreBoiteMessage.Confirmation,
      message: GChaine.format(
        GTraductions.getValeur("selecteurPJ.msgConfirmPJ"),
        [aDocJoint.getLibelle()],
      ),
    })
    .then((aGenreAction) => {
      if (aGenreAction === EGenreAction.Valider) {
        aSuccessCallback();
      }
    });
}
function _ouvrirDocumentJointParent(aDocJoint) {
  window.open(
    GChaine.creerUrlBruteLienExterne(aDocJoint, {
      genreRessource: EGenreRessource.DocJointEleve,
    }),
  );
}
function _getHtmlMotif(aMotif, aAvecCouleur) {
  const H = [];
  if (!!aMotif) {
    if (aAvecCouleur) {
      const lStylesCouleurMotif = [];
      if (!!aMotif.couleur) {
        lStylesCouleurMotif.push(GStyle.composeCouleurBordure("black"));
        lStylesCouleurMotif.push(GStyle.composeCouleurFond(aMotif.couleur));
      }
      H.push(
        '<span class="InlineBlock AlignementMilieuVertical MargeDroit" style="width: 12px; height: 12px; ',
        lStylesCouleurMotif.join(" "),
        '">',
        "&nbsp;",
        "</span>",
      );
    }
    H.push(
      '<span class="AlignementMilieuVertical">',
      aMotif.getLibelle(),
      "</span>",
    );
  }
  return H.join("");
}
module.exports = { DonneesListe_SuiviJustificationsAbsRetards };
