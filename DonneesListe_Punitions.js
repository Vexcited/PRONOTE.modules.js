const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  TypeEtatAffichagePunitionUtil,
} = require("TypeEtatAffichagePunition.js");
class DonneesListe_Punitions extends ObjetDonneesListe {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      avecSelection: false,
      avecSuppression: false,
      avecContenuTronque: true,
    });
  }
  getControleur(aInstanceDonneesListe, aInstanceListe) {
    return $.extend(
      true,
      super.getControleur(aInstanceDonneesListe, aInstanceListe),
      {
        nodeCertificat: function (aligne) {
          const lArticle = aInstanceDonneesListe.Donnees.get(aligne);
          if (lArticle && lArticle.documentsTAF) {
            $(this.node).on("click", () => {
              ObjetMenuContextuel.afficher({
                pere: aInstanceListe,
                initCommandes: function (aMenu) {
                  lArticle.documentsTAF.parcourir((aDocument) => {
                    if (aDocument.existe()) {
                      aMenu.add(aDocument.getLibelle(), true, () => {
                        _openDocumentDArticle(aDocument);
                      });
                    }
                  });
                },
              });
            });
          }
        },
        nodePJPunition: function (aligne) {
          const lArticle = aInstanceDonneesListe.Donnees.get(aligne);
          if (lArticle && lArticle.documents) {
            $(this.node).on("click", () => {
              ObjetMenuContextuel.afficher({
                pere: aInstanceListe,
                initCommandes: function (aMenu) {
                  lArticle.documents.parcourir((aDocument) => {
                    if (aDocument.existe()) {
                      aMenu.add(aDocument.getLibelle(), true, () => {
                        _openDocumentDArticle(aDocument);
                      });
                    }
                  });
                },
              });
            });
          }
        },
      },
    );
  }
  avecEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_Punitions.colonnes.realisee &&
      !(aParams.article.estUnCumul && aParams.article.estMultiProgrammation)
    );
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Punitions.colonnes.date:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? ObjetDonneesListe.ETypeCellule.Texte
          : ObjetDonneesListe.ETypeCellule.Date;
      case DonneesListe_Punitions.colonnes.reportee:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_Punitions.colonnes.etat:
        return ObjetDonneesListe.ETypeCellule.Image;
      case DonneesListe_Punitions.colonnes.realisee:
        return ObjetDonneesListe.ETypeCellule.DateCalendrier;
      case DonneesListe_Punitions.colonnes.pj:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_Punitions.colonnes.pjPunition:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Punitions.colonnes.classe:
        return aParams.article.estUnCumul
          ? aParams.article.classe.getLibelle()
          : "";
      case DonneesListe_Punitions.colonnes.nom:
        return aParams.article.estUnCumul
          ? aParams.article.eleve.getLibelle()
          : "";
      case DonneesListe_Punitions.colonnes.regime:
        return aParams.article.strRegime || "";
      case DonneesListe_Punitions.colonnes.date:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? GTraductions.getValeur("punition.xSeances", [
              aParams.article.nombreSeances,
            ])
          : aParams.article.dateExecution;
      case DonneesListe_Punitions.colonnes.heure:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? ""
          : aParams.article.strHeureExecution;
      case DonneesListe_Punitions.colonnes.surveillant:
        return (aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation) ||
          !aParams.article.strSurveillant
          ? ""
          : aParams.article.strSurveillant;
      case DonneesListe_Punitions.colonnes.lieu:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? ""
          : aParams.article.strLieu;
      case DonneesListe_Punitions.colonnes.reportee:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? ""
          : aParams.article.estReportee;
      case DonneesListe_Punitions.colonnes.travailAFaire:
        return aParams.article.commentaireDemande;
      case DonneesListe_Punitions.colonnes.punition:
        return !aParams.article.estUnCumul
          ? ""
          : aParams.article.naturePunition.getLibelle();
      case DonneesListe_Punitions.colonnes.motif:
        return !aParams.article.estUnCumul ? "" : aParams.article.strMotifs;
      case DonneesListe_Punitions.colonnes.demandeur:
        return !aParams.article.estUnCumul
          ? ""
          : aParams.article.demandeur
            ? aParams.article.demandeur.getLibelle()
            : "";
      case DonneesListe_Punitions.colonnes.duree:
        return aParams.article.strDuree ? aParams.article.strDuree : "";
      case DonneesListe_Punitions.colonnes.etat:
        return TypeEtatAffichagePunitionUtil.getClassImage(
          aParams.article.etatAffichagePunition,
        );
      case DonneesListe_Punitions.colonnes.realisee:
        return aParams.article.estUnCumul &&
          aParams.article.estMultiProgrammation
          ? ""
          : aParams.article.dateRealisation;
      case DonneesListe_Punitions.colonnes.pjPunition:
        if (
          (!aParams.article.estUnCumul &&
            aParams.article.estMultiProgrammation) ||
          !aParams.article.avecPJ ||
          !aParams.article.documents
        ) {
          return "";
        }
        if (aParams.article.documents.count() === 1) {
          const lUrlLienDocument = GChaine.creerUrlBruteLienExterne(
            aParams.article.documents.get(0),
            { genreRessource: EGenreRessource.DocJointEleve },
          );
          const lTitleDocument = aParams.article.documents.get(0).getLibelle();
          const lDocumentUnique = [];
          lDocumentUnique.push(
            '<a href="',
            lUrlLienDocument,
            '" target="_blank" title="',
            GChaine.toTitle(lTitleDocument),
            '">',
          );
          lDocumentUnique.push(
            '<div class="Image_Trombone" style="margin-left:auto; margin-right:auto;"></div>',
          );
          lDocumentUnique.push("</a>");
          return lDocumentUnique.join("");
        }
        return (
          '<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;"' +
          GHtml.composeAttr("ie-node", "nodePJPunition", aParams.ligne) +
          ">&nbsp;</div>"
        );
      case DonneesListe_Punitions.colonnes.pj:
        if (
          (!aParams.article.estUnCumul &&
            aParams.article.estMultiProgrammation) ||
          !aParams.article.avecPJTaf ||
          !aParams.article.documentsTAF ||
          aParams.article.documentsTAF.count() === 0
        ) {
          return "";
        }
        if (aParams.article.documentsTAF.count() === 1) {
          const lUrlLienDocumentTAF = GChaine.creerUrlBruteLienExterne(
            aParams.article.documentsTAF.get(0),
            { genreRessource: EGenreRessource.DocJointEleve },
          );
          const lTitleDocumentTaf = aParams.article.documentsTAF
            .get(0)
            .getLibelle();
          const lDocumentTafUnique = [];
          lDocumentTafUnique.push(
            '<a href="',
            lUrlLienDocumentTAF,
            '" target="_blank" title="',
            GChaine.toTitle(lTitleDocumentTaf),
            '">',
          );
          lDocumentTafUnique.push(
            '<div class="Image_Trombone" style="margin-left:auto; margin-right:auto;"></div>',
          );
          lDocumentTafUnique.push("</a>");
          return lDocumentTafUnique.join("");
        }
        return (
          '<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;"' +
          GHtml.composeAttr("ie-node", "nodeCertificat", aParams.ligne) +
          ">&nbsp;</div>"
        );
    }
    return "";
  }
  getHintForce(aParams) {
    if (aParams.idColonne === DonneesListe_Punitions.colonnes.etat) {
      if (aParams.article) {
        if (aParams.article.hintEtatPunition) {
          return aParams.article.hintEtatPunition;
        }
      }
    }
    return "";
  }
  getVisible(D) {
    return D.visible;
  }
  getClass(aParams) {
    const lClass = [];
    if (
      [
        DonneesListe_Punitions.colonnes.date,
        DonneesListe_Punitions.colonnes.heure,
        DonneesListe_Punitions.colonnes.surveillant,
        DonneesListe_Punitions.colonnes.lieu,
      ].includes(aParams.idColonne)
    ) {
      if (aParams.article.estUnCumul && aParams.article.estMultiProgrammation) {
        lClass.push("Gras");
      } else if (
        !aParams.article.estUnCumul &&
        aParams.article.estMultiProgrammation
      ) {
        lClass.push("Italique");
      }
    }
    return lClass.join(" ");
  }
  getTri(aColonneDeTri, aGenreTri) {
    if (aColonneDeTri === null || aColonneDeTri === undefined) {
      return [];
    }
    const lTris = [];
    let lTriAvecDate = false;
    for (let i = 0; i < aColonneDeTri.length; i++) {
      let lId = this.getId(aColonneDeTri[i]);
      let lGenre;
      if (aGenreTri.length && aGenreTri.length === aColonneDeTri.length) {
        lGenre = aGenreTri[i];
      } else {
        lGenre = aGenreTri;
      }
      switch (lId) {
        case DonneesListe_Punitions.colonnes.classe:
          lTris.push(
            ObjetTri.init((D) => {
              return D.classe.getLibelle();
            }, lGenre),
          );
          break;
        case DonneesListe_Punitions.colonnes.nom:
          lTris.push(
            ObjetTri.init((D) => {
              return D.eleve.getLibelle();
            }, lGenre),
          );
          break;
        case DonneesListe_Punitions.colonnes.date:
          lTriAvecDate = true;
          lTris.push(
            ObjetTri.init((D) => {
              return !D.estUnCumul ? (!D.dateExecution ? 2 : 1) : 0;
            }),
          );
          lTris.push(ObjetTri.init("dateExecution", lGenre));
          break;
        case DonneesListe_Punitions.colonnes.heure:
          lTris.push(
            ObjetTri.init((D) => {
              return D.placeExecution;
            }, lGenre),
          );
          break;
        case DonneesListe_Punitions.colonnes.etat:
          lTris.push(
            ObjetTri.init((D) => {
              return D.getGenre();
            }, lGenre),
          );
          break;
        case DonneesListe_Punitions.colonnes.realisee:
          lTris.push(
            ObjetTri.init((D) => {
              return D.dateRealisation;
            }, lGenre),
          );
          break;
        default:
          lTris.push(
            ObjetTri.init(
              this.getValeurPourTri.bind(this, aColonneDeTri[i]),
              lGenre,
            ),
          );
          break;
      }
    }
    lTris.push(
      ObjetTri.init((D) => {
        return D.classe.getLibelle();
      }),
    );
    lTris.push(
      ObjetTri.init((D) => {
        return D.eleve.getLibelle();
      }),
    );
    if (!lTriAvecDate) {
      lTris.push(
        ObjetTri.init((D) => {
          const lTest = !D.estUnCumul ? (!D.dateExecution ? 2 : 1) : 0;
          return lTest;
        }),
      );
      lTris.push(ObjetTri.init("dateExecution"));
    }
    return ObjetTri.initRecursif("pere", lTris);
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_Punitions.colonnes.realisee: {
        aParams.article.dateRealisation = V;
        break;
      }
    }
  }
  initialiserObjetGraphique(aParams, aInstance) {
    aInstance.setParametres(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      GParametres.DerniereDate,
      GParametres.JoursOuvres,
      null,
      GParametres.JoursFeries,
      true,
    );
    if (aParams.article.dateDemande) {
      aInstance.setPremiereDateSaisissable(aParams.article.dateDemande);
    }
  }
  setDonneesObjetGraphique(aParams, aInstance) {
    aInstance.setDonnees(aParams.article.dateRealisation);
  }
}
DonneesListe_Punitions.colonnes = {
  classe: "punition_prog_classe",
  nom: "punition_prog_nomEleve",
  regime: "punition_prog_regime",
  date: "punition_prog_date",
  heure: "punition_prog_heure",
  surveillant: "punition_prog_surveillant",
  lieu: "punition_prog_lieu",
  reportee: "punition_prog_reportee",
  travailAFaire: "punition_prog_TAF",
  punition: "punition_prog_punition",
  motif: "punition_prog_motif",
  pjPunition: "punition_prog_PJPunition",
  demandeur: "punition_prog_demandeur",
  duree: "punition_prog_duree",
  etat: "punition_prog_etat",
  realisee: "punition_prog_realisee",
  pj: "punition_prog_pj",
};
DonneesListe_Punitions.options = {
  colonnes: _getColonnes(),
  colonnesCachees: [],
  hauteurAdapteContenu: true,
  piedDeListe: null,
  scrollHorizontal: true,
};
function _getColonnes() {
  const lColonnes2 = [];
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.classe,
    taille: 100,
    titre: [GTraductions.getValeur("Eleve"), GTraductions.getValeur("Classe")],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.nom,
    taille: 150,
    titre: [TypeFusionTitreListe.FusionGauche, GTraductions.getValeur("Nom")],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.regime,
    taille: ObjetListe.initColonne(20, 100, 280),
    titre: {
      libelle: GTraductions.getValeur("punition.titre.regime"),
      nbLignes: 3,
    },
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.date,
    taille: 64,
    titre: [
      GTraductions.getValeur("punition.titre.programmation"),
      GTraductions.getValeur("Date"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.heure,
    taille: 40,
    titre: [TypeFusionTitreListe.FusionGauche, GTraductions.getValeur("Heure")],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.surveillant,
    taille: 90,
    titre: [
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("punition.titre.Surveillant"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.lieu,
    taille: 90,
    titre: [
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("punition.titre.Lieu"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.reportee,
    taille: 60,
    titre: [
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("punition.titre.Reportee"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.travailAFaire,
    taille: ObjetListe.initColonne(30, 150, 300),
    titre: GTraductions.getValeur("punition.titre.taf"),
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.punition,
    taille: 80,
    titre: [
      GTraductions.getValeur("punition.titre.Notification"),
      GTraductions.getValeur("punition.titre.Punition"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.motif,
    taille: ObjetListe.initColonne(30, 100, 300),
    titre: [
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("punition.titre.Motif"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.pjPunition,
    taille: 16,
    titre: [
      TypeFusionTitreListe.FusionGauche,
      { classeCssImage: "Image_Trombone" },
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.demandeur,
    taille: ObjetListe.initColonne(20, 100, 200),
    titre: [
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("punition.titre.Demandeur"),
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.duree,
    taille: 50,
    titre: [
      TypeFusionTitreListe.FusionGauche,
      {
        libelleHtml:
          GTraductions.getValeur("Heure") +
          " / " +
          GTraductions.getValeur("Duree"),
      },
    ],
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.etat,
    taille: 25,
    titre: GTraductions.getValeur("punition.titre.Etat"),
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.realisee,
    taille: 50,
    titre: { libelleHtml: GTraductions.getValeur("punition.titre.RealiseLe") },
  });
  lColonnes2.push({
    id: DonneesListe_Punitions.colonnes.pj,
    taille: 16,
    titre: { classeCssImage: "Image_Trombone" },
  });
  return lColonnes2;
}
function _openDocumentDArticle(aDocument) {
  window.open(
    GChaine.creerUrlBruteLienExterne(aDocument, {
      genreRessource: EGenreRessource.DocJointEleve,
    }),
  );
}
module.exports = DonneesListe_Punitions;
