const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetTri } = require("ObjetTri.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const {
  TypeModuleFonctionnelPiedBulletin,
} = require("TypeModuleFonctionnelPiedBulletin.js");
const {
  TypeGenreParcoursEducatifUtil,
} = require("TypeGenreParcoursEducatif.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { TypeAvisConseilUtil } = require("TypeAvisConseil.js");
const {
  UtilitaireBulletinEtReleve_Mobile,
} = require("UtilitaireBulletinEtReleve_Mobile.js");
class PiedDeBulletinMobile extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteurPdB = new ObjetMoteurPiedDeBulletin();
    this.donneesContexte = {
      typeContexteBulletin: 0,
      avecSaisie: false,
      typeReleveBulletin: 0,
    };
    this.donneesPiedDeBulletin = null;
    this.donneesAbsences = null;
  }
  construireAffichage() {
    const lHtml = [];
    const lModulesHorsOnglet = this.moteurPdB.getModulesHorsOnglets(
      this.donneesContexte,
    );
    for (let i = 0; i < lModulesHorsOnglet.length; i++) {
      lHtml.push(
        '<div class="PDB_ModuleFonctionnel">',
        construireModuleFonctionnel.call(this, lModulesHorsOnglet[i]),
        "</div>",
      );
    }
    const lModulesOnglet = this.moteurPdB.getModulesOnglets(
      this.donneesContexte,
    );
    for (let j = 0; j < lModulesOnglet.length; j++) {
      lHtml.push(
        '<div class="PDB_ModuleFonctionnel">',
        construireModuleFonctionnel.call(this, lModulesOnglet[j]),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  setDonneesContexte(aDonnees) {
    Object.assign(this.donneesContexte, aDonnees);
  }
  setDonneesPiedDeBulletin(aDonnees, aDonneesAbsences) {
    this.donneesPiedDeBulletin = aDonnees;
    this.donneesAbsences = aDonneesAbsences;
  }
}
function construireModuleFonctionnel(aTypeModuleFonctionnel) {
  const H = [];
  switch (aTypeModuleFonctionnel) {
    case TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire:
      H.push(
        _construireVieScolaire(
          this.donneesPiedDeBulletin,
          this.donneesAbsences,
        ),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
      H.push(_construireAttestations(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
      H.push(_construireListeAppreciations(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
      H.push(_construireParcoursEducatif(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
      H.push(_construireBilanDeCycle(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
      H.push(_construireStages(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
      H.push(_construireOrientations(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Legende:
      H.push(_construireLegende(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Projets:
      H.push(_construireProjets(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
      H.push(_construireCredits(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
      H.push(_construireEngagements(this.donneesPiedDeBulletin));
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
      H.push(_construireMentions(this.donneesPiedDeBulletin));
      break;
    default:
      break;
  }
  return H.join("");
}
function _construireVieScolaire(aDonneesPiedDeBulletin, aDonneesAbsences) {
  const lHtml = [];
  lHtml.push(
    '<div style="margin-top:10px;">',
    UtilitaireBulletinEtReleve_Mobile.composeVieScolaire(aDonneesAbsences),
    "</div>",
  );
  return lHtml.join("");
}
function _construireAttestations(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (
    !!aDonneesPiedDeBulletin &&
    !!aDonneesPiedDeBulletin.ListeAttestationsEleve
  ) {
    lHtml.push("<div>", '<ul style="display:table;">');
    aDonneesPiedDeBulletin.ListeAttestationsEleve.parcourir((aAttestation) => {
      lHtml.push(
        '<li style="display:table-row;">',
        '<span style="display:table-cell;">- ',
        aAttestation.getLibelle(),
        "</span>",
        '<div class="Italique GrandEspaceGauche">',
        aAttestation.delivree
          ? GTraductions.getValeur("FicheEleve.delivree") +
              " " +
              GDate.formatDate(aAttestation.date, "%JJ/%MM/%AAAA")
          : GTraductions.getValeur("FicheEleve.nonDelivree"),
        "</div>",
        "</li>",
      );
    });
    lHtml.push("</ul>", "</div>");
  }
  return lHtml.join("");
}
function _construireListeAppreciations(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.ListeAppreciations) {
    if (
      !!aDonneesPiedDeBulletin.ListeAppreciations.commentaires &&
      !!aDonneesPiedDeBulletin.ListeAppreciations.commentaires.count()
    ) {
      const lCommentaires =
        aDonneesPiedDeBulletin.ListeAppreciations.commentaires;
      for (
        let i = 0, lNbrCommentaires = lCommentaires.count();
        i < lNbrCommentaires;
        i++
      ) {
        const lCommentaire = lCommentaires.get(i);
        if (
          !!lCommentaire.ListeAppreciations &&
          !!lCommentaire.ListeAppreciations.count() &&
          !!lCommentaires.Intitule &&
          lCommentaires.Intitule !== "" &&
          lCommentaire.ListeAppreciations.getTableauLibelles().join(", ") !== ""
        ) {
          lCommentaire.ListeAppreciations.setTri([ObjetTri.init("Genre")]);
          lCommentaire.ListeAppreciations.trier();
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lCommentaires.Intitule,
              contenuDAppreciation:
                lCommentaire.ListeAppreciations.getTableauLibelles().join(", "),
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
      }
    }
    if (
      !!aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse &&
      !!aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse.count()
    ) {
      const lAppreciationsConseilDeClasse =
        aDonneesPiedDeBulletin.ListeAppreciations.conseilDeClasse;
      for (
        let i = 0,
          lNbrAppreciationConseilDeClasse =
            lAppreciationsConseilDeClasse.count();
        i < lNbrAppreciationConseilDeClasse;
        i++
      ) {
        const lAppConseilDeClass = lAppreciationsConseilDeClasse.get(i);
        if (
          !!lAppConseilDeClass.ListeAppreciations &&
          !!lAppConseilDeClass.ListeAppreciations.count() &&
          !!lAppConseilDeClass.Intitule &&
          lAppConseilDeClass.Intitule !== "" &&
          lAppConseilDeClass.ListeAppreciations.getTableauLibelles().join(
            ", ",
          ) !== ""
        ) {
          lAppConseilDeClass.ListeAppreciations.setTri([
            ObjetTri.init("Genre"),
          ]);
          lAppConseilDeClass.ListeAppreciations.trier();
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lAppConseilDeClass.Intitule,
              contenuDAppreciation:
                lAppConseilDeClass.ListeAppreciations.getTableauLibelles().join(
                  ", ",
                ),
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
      }
    }
    if (
      !!aDonneesPiedDeBulletin.ListeAppreciations.cpe &&
      !!aDonneesPiedDeBulletin.ListeAppreciations.cpe.count()
    ) {
      const lAppreciationsCpe = aDonneesPiedDeBulletin.ListeAppreciations.cpe;
      for (
        let i = 0, lNbrAppreciationsCpe = lAppreciationsCpe.count();
        i < lNbrAppreciationsCpe;
        i++
      ) {
        const lAppCpe = lAppreciationsCpe.get(i);
        if (
          !!lAppCpe.ListeAppreciations &&
          !!lAppCpe.ListeAppreciations.count() &&
          !!lAppCpe.Intitule &&
          lAppCpe.Intitule !== "" &&
          lAppCpe.ListeAppreciations.getTableauLibelles().join(", ") !== ""
        ) {
          lAppCpe.ListeAppreciations.setTri([ObjetTri.init("Genre")]);
          lAppCpe.ListeAppreciations.trier();
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lAppCpe.Intitule,
              contenuDAppreciation:
                lAppCpe.ListeAppreciations.getTableauLibelles().join(", "),
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
      }
    }
    if (
      !!aDonneesPiedDeBulletin.ListeAppreciations.general &&
      !!aDonneesPiedDeBulletin.ListeAppreciations.general.count()
    ) {
      const lAppreciationsGeneral =
        aDonneesPiedDeBulletin.ListeAppreciations.general;
      for (
        let i = 0, lNbrAppreciationsGeneral = lAppreciationsGeneral.count();
        i < lNbrAppreciationsGeneral;
        i++
      ) {
        const lAppGeneral = lAppreciationsGeneral.get(i);
        if (
          !!lAppGeneral.ListeAppreciations &&
          !!lAppGeneral.ListeAppreciations.count() &&
          !!lAppGeneral.Intitule &&
          lAppGeneral.Intitule !== "" &&
          lAppGeneral.ListeAppreciations.getTableauLibelles().join(", ") !== ""
        ) {
          lAppGeneral.ListeAppreciations.setTri([ObjetTri.init("Genre")]);
          lAppGeneral.ListeAppreciations.trier();
          lHtml.push(
            UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
              intituleDAppreciation: lAppGeneral.Intitule,
              contenuDAppreciation:
                lAppGeneral.ListeAppreciations.getTableauLibelles().join(", "),
              styleBlockIntitule: "color : #616161;",
              styleBlockContenu:
                "border:1px solid #616161; background-color: #F1F1F1;",
            }),
          );
        }
      }
    }
  }
  return lHtml.join("");
}
function _construireParcoursEducatif(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin) {
    const lListeGenresParcoursPublies = new ObjetListeElements();
    if (!!aDonneesPiedDeBulletin.listeGenreParcours) {
      aDonneesPiedDeBulletin.listeGenreParcours.parcourir((D) => {
        if (!!D && D.autorise) {
          lListeGenresParcoursPublies.addElement(D);
        }
      });
    }
    const lListeParcoursEducatifs = new ObjetListeElements();
    if (!!aDonneesPiedDeBulletin.listeEvntsParcoursPeda) {
      aDonneesPiedDeBulletin.listeEvntsParcoursPeda.parcourir((D) => {
        if (!!D && !!D.Descr) {
          lListeParcoursEducatifs.addElement(D);
        }
      });
    }
    if (
      lListeParcoursEducatifs.count() > 0 &&
      lListeGenresParcoursPublies.count() > 0
    ) {
      lHtml.push("<div>");
      let lCumulGenreParcoursVide;
      lListeGenresParcoursPublies.parcourir((aGenreParcoursEducatif) => {
        lCumulGenreParcoursVide = false;
        lListeParcoursEducatifs.parcourir((aParcoursEducatif) => {
          if (
            aParcoursEducatif.getGenre() === aGenreParcoursEducatif.getGenre()
          ) {
            if (!lCumulGenreParcoursVide) {
              lHtml.push(
                '<div class="Espace Gras">',
                TypeGenreParcoursEducatifUtil.getLibelle(
                  aGenreParcoursEducatif.getGenre(),
                ),
                "</div>",
              );
              lCumulGenreParcoursVide = true;
            }
            lHtml.push(
              '<div class="Espace">',
              '<div class="PetitEspaceHaut" style="color: #9C9C9C;">',
              GDate.formatDate(
                aParcoursEducatif.Date,
                " " + GTraductions.getValeur("Le") + " %JJ/%MM/%AA",
              ),
              aParcoursEducatif.SuiviPar !== ""
                ? "&nbsp-&nbsp;" +
                    GChaine.format(
                      GTraductions.getValeur("ParcoursPeda.colonne.suiviParS"),
                      [aParcoursEducatif.SuiviPar],
                    )
                : "",
              "</div>",
              '<div class="Espace" style="border: 1px solid #c4c4c4;">',
              aParcoursEducatif.Descr,
              "</div>",
              "</div>",
            );
          }
        });
      });
      lHtml.push("</div>");
    }
  }
  return lHtml.join("");
}
function _construireBilanDeCycle(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (
    !!aDonneesPiedDeBulletin &&
    !!aDonneesPiedDeBulletin.listePiliers &&
    aDonneesPiedDeBulletin.listePiliers.count()
  ) {
    lHtml.push('<div class="card" style="margin:0.5rem;">');
    lHtml.push(
      '<div class="Espace Gras">' +
        GTraductions.getValeur("competences.BilansDeCycle") +
        "</div>",
    );
    lHtml.push('<div class="card-content">');
    lHtml.push('<ul class="collection with-header">');
    aDonneesPiedDeBulletin.listePiliers.parcourir((aPilier) => {
      if (aPilier.getGenre() === EGenreRessource.Pilier) {
        const lNiveauDAcquisition =
          GParametres.listeNiveauxDAcquisitions.getElementParElement(
            aPilier.niveauDAcquisition,
          );
        lHtml.push(
          '<li class="collection-item">',
          '<div style="padding-right: 2.5rem;">',
          aPilier.getLibelle(),
          "</div>",
          '<div class="secondary-content">',
          EGenreNiveauDAcquisitionUtil.getImage(lNiveauDAcquisition),
          "</div>",
          "</li>",
        );
      } else {
        lHtml.push(
          '<li class="collection-header" style="border-bottom:#d1d1d1 1px solid;">',
          aPilier.getLibelle(),
          "</li>",
        );
      }
    });
    lHtml.push("</ul>");
    lHtml.push("</div>");
    lHtml.push("</div>");
  }
  return lHtml.join("");
}
function _construireStages(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.listeStages) {
    aDonneesPiedDeBulletin.listeStages.parcourir((aStage) => {
      aStage.listeDemandeurs = new ObjetListeElements();
      if (!!aStage.listeProfesseurs) {
        aStage.listeDemandeurs.add(aStage.listeProfesseurs);
      }
      if (aStage.listeMaitresDeStage) {
        aStage.listeDemandeurs.add(aStage.listeMaitresDeStage);
      }
      const lExisteDemandeurs =
        !!aStage.listeDemandeurs && aStage.listeDemandeurs.count() > 0;
      lHtml.push('<div class="notes-data-conteneur">');
      if (!!aStage.session) {
        lHtml.push(
          '<div class="',
          lExisteDemandeurs ? " grey-text text-darken-2" : "",
          '">',
          aStage.session,
          "</div>",
        );
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
      lHtml.push(
        '<div class="',
        lExisteDemandeurs ? " grey-text text-darken-2" : "",
        '">',
        lLibelleStage.join(""),
        "</div>",
      );
      if (lExisteDemandeurs) {
        let existeAppreciations = false;
        for (
          let i = 0, lNbrDemandeur = aStage.listeDemandeurs.count();
          i < lNbrDemandeur;
          i++
        ) {
          const lDemandeur = aStage.listeDemandeurs.get(i);
          if (
            (!!lDemandeur.getLibelle() || !!lDemandeur.appreciation) &&
            !existeAppreciations
          ) {
            lHtml.push('<div class="notes-data-conteneur encadre">');
            lHtml.push('<ul class="browser-default">');
            existeAppreciations = true;
          }
          if (!!lDemandeur.getLibelle() || !!lDemandeur.appreciation) {
            lHtml.push("<li>");
            lHtml.push("<div>", lDemandeur.getLibelle(), "</div>");
            lHtml.push('<div class="Gras">', lDemandeur.appreciation, "</div>");
            lHtml.push("</li>");
          }
          if (
            i === aStage.listeDemandeurs.count() - 1 &&
            !!existeAppreciations
          ) {
            lHtml.push("</ul>");
            lHtml.push("</div>");
          }
        }
      }
      lHtml.push("</div>");
    });
  }
  return lHtml.join("");
}
function _construireOrientations(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin) {
    const lObjetOrientation = aDonneesPiedDeBulletin.Orientation;
    if (
      !!lObjetOrientation &&
      !!lObjetOrientation.listeRubriques &&
      lObjetOrientation.listeRubriques.count() > 0
    ) {
      lHtml.push('<div style="margin-top:10px;">');
      const construitStrLibelleVoeuOrientation = function (aVoeuOrientation) {
        const lStrOrientation = [];
        if (!!aVoeuOrientation) {
          if (!!aVoeuOrientation.orientation) {
            lStrOrientation.push(aVoeuOrientation.orientation.getLibelle());
          } else if (!!aVoeuOrientation.commentaire) {
            lStrOrientation.push(aVoeuOrientation.commentaire);
          }
          if (!!aVoeuOrientation.listeSpecialites) {
            aVoeuOrientation.listeSpecialites.parcourir((aSpe) => {
              if (!!aSpe && !!aSpe.code) {
                lStrOrientation.push(aSpe.code);
              }
            });
          }
        }
        return lStrOrientation.join(" - ");
      };
      lObjetOrientation.listeRubriques.parcourir((aRubrique) => {
        lHtml.push("<div>");
        if (
          aRubrique.getGenre() ===
            TypeRubriqueOrientation.RO_IntentionFamille ||
          aRubrique.getGenre() === TypeRubriqueOrientation.RO_VoeuDefinitif
        ) {
          if (!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0) {
            let lTitreBloc;
            if (
              aRubrique.getGenre() ===
              TypeRubriqueOrientation.RO_IntentionFamille
            ) {
              lTitreBloc = GTraductions.getValeur(
                "Orientation.Ressources.IntentionsEtAvisProvisoire",
              );
            } else {
              lTitreBloc = GTraductions.getValeur(
                "Orientation.Ressources.ChoixEtPropositions",
              );
            }
            lHtml.push(
              '<div class="Gras" style="color : #616161;">',
              lTitreBloc,
              "</div>",
            );
            aRubrique.listeVoeux.parcourir((aVoeu) => {
              lHtml.push(
                '<div><span class="Gras">',
                construitStrLibelleVoeuOrientation(aVoeu),
                "</span>",
              );
              if (!!aVoeu.avecStagePasserelleFamille) {
                lHtml.push(
                  " (",
                  GTraductions.getValeur(
                    "Orientation.Ressources.DemandeStagePasserelle",
                  ),
                  ")",
                );
              }
              lHtml.push("</div>");
              if (!!aVoeu.reponseCC || !!aVoeu.motivation) {
                lHtml.push("<div>");
                if (!!aVoeu.reponseCC) {
                  let lAvisLibelle = TypeAvisConseilUtil.getLibelle(
                    aVoeu.reponseCC,
                  );
                  if (
                    aRubrique.getGenre() ===
                    TypeRubriqueOrientation.RO_VoeuDefinitif
                  ) {
                    lAvisLibelle = TypeAvisConseilUtil.getLibelleOuiNon(
                      aVoeu.reponseCC,
                    );
                  }
                  lHtml.push(
                    '<span class="Bloc_TypeAvisConseil TypeAvis_',
                    aVoeu.reponseCC,
                    '" style="margin-right: 5px;">',
                    lAvisLibelle || "",
                    "</span>",
                  );
                }
                if (aVoeu.motivation) {
                  lHtml.push(aVoeu.motivation);
                }
                if (aVoeu.avecStagePasserelleConseil) {
                  lHtml.push(
                    " (",
                    GTraductions.getValeur(
                      "Orientation.Ressources.StagePasserellePropose",
                    ),
                    ")",
                  );
                }
                lHtml.push("</div>");
              }
            });
          }
        } else {
          const lPremierVoeu =
            !!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0
              ? aRubrique.listeVoeux.getPremierElement()
              : null;
          if (!!lPremierVoeu) {
            lHtml.push(
              "<b>",
              aRubrique.getLibelle(),
              "</b> : ",
              construitStrLibelleVoeuOrientation(lPremierVoeu),
            );
            if (!!lPremierVoeu.avecStagePasserelleConseil) {
              lHtml.push(
                " - ",
                GTraductions.getValeur(
                  "Orientation.Ressources.StagePasserellePropose",
                ),
              );
            }
          }
        }
        lHtml.push("</div>");
      });
      lHtml.push("</div>");
    }
  }
  return lHtml.join("");
}
function _construireLegende(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.legende) {
    lHtml.push(
      '<div class="Italique Espace">',
      aDonneesPiedDeBulletin.legende,
      "</div>",
    );
  }
  return lHtml.join("");
}
function _construireProjets(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.ListeProjets) {
    lHtml.push('<div class="Espace">');
    if (aDonneesPiedDeBulletin.ListeProjets.count() > 0) {
      lHtml.push(
        GTraductions.getValeur("BulletinEtReleve.Projets.Detail", [
          aDonneesPiedDeBulletin.ListeProjets.getTableauLibelles().join(", "),
        ]),
      );
    } else {
      lHtml.push(GTraductions.getValeur("BulletinEtReleve.Projets.Aucun"));
    }
    lHtml.push("</div>");
  }
  return lHtml.join("");
}
function _construireCredits(aDonneesPiedDeBulletin) {
  const lHtml = [];
  if (!!aDonneesPiedDeBulletin && !!aDonneesPiedDeBulletin.listeCredits) {
    aDonneesPiedDeBulletin.listeCredits.parcourir((D) => {
      if (!!D && !!D.credits) {
        lHtml.push(
          "<div><span>",
          D.getLibelle(),
          "</span> <span>",
          D.credits,
          "</span></div>",
        );
      }
    });
  }
  return lHtml.join("");
}
function _construireEngagements(aDonneesPiedDeBulletin) {
  const H = [];
  if (aDonneesPiedDeBulletin.listeEngagements) {
    let lLibelle = GTraductions.getValeur("PiedDeBulletin.AucunEngagement");
    if (aDonneesPiedDeBulletin.listeEngagements.count()) {
      lLibelle = aDonneesPiedDeBulletin.listeEngagements
        .getTableauLibelles()
        .join(", ");
    }
    H.push(
      `<div class="notes-data-conteneur"><p><span class="Gras"> ${GTraductions.getValeur("PiedDeBulletin.Engagements")}</span> : ${lLibelle}</p></div>`,
    );
  }
  return H.join("");
}
function _construireMentions(aDonneesPiedDeBulletin) {
  const H = [];
  if (
    aDonneesPiedDeBulletin.ListeMentionsClasse &&
    aDonneesPiedDeBulletin.ListeMentionsClasse.count()
  ) {
    let lLibelle = [];
    aDonneesPiedDeBulletin.ListeMentionsClasse.parcourir((aMention) => {
      lLibelle.push(`${aMention.Nombre} ${aMention.getLibelle()}`);
    });
    H.push(
      `<div class="notes-data-conteneur"><p><span class="Gras"> ${GTraductions.getValeur("Appreciations.Mentions")}</span> : ${lLibelle.join(", ")}</p></div>`,
    );
  }
  return H.join("");
}
module.exports = { PiedDeBulletinMobile };
