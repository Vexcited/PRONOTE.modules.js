const { TypeDroits } = require("ObjetDroitsPN.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreElementDossier } = require("Enumere_ElementDossier.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreMediaUtil } = require("Enumere_Media.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class DonneesListe_Dossiers extends ObjetDonneesListe {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.setOptions({
      avecDeploiement: true,
      avecImageSurColonneDeploiement: true,
      avecEventDeploiementSurCellule: false,
      avecEvnt_Creation: true,
      avecEvnt_ApresCreation: true,
      avecEvnt_Suppression: true,
      avecInterruptionSuppression: true,
    });
    this.eventAjouter = aParam.callbackAjouterElement;
    this.callbackmodifierDossier = aParam.callbackmodifierDossier;
    this.callbacksupprimerDossier = aParam.callbacksupprimerDossier;
    this.callbackmodifierElement = aParam.callbackmodifierElement;
    this.callbacksupprimerElement = aParam.callbacksupprimerElement;
    this.autorisations = {
      modifier: GApplication.droits.get(
        TypeDroits.dossierVS.modifierDossiersVS,
      ),
      publie: GApplication.droits.get(TypeDroits.dossierVS.publierDossiersVS),
      accesDecrochage: GApplication.droits.get(
        TypeDroits.decrochageScolaire.acces,
      ),
      suiviDecrochage: GApplication.droits.get(
        TypeDroits.decrochageScolaire.suivi,
      ),
    };
  }
  getControleur(aDonneesListe, aListe) {
    return $.extend(true, super.getControleur(aDonneesListe, aListe), {
      nodeBtnAjouterElement: function (aLigne) {
        $(this.node).on("click", () => {
          const lArticle = aDonneesListe.Donnees.get(aLigne);
          aDonneesListe.eventAjouter.call(null, lArticle);
        });
      },
      nodePJ: function (aligne) {
        const lArticle = aDonneesListe.Donnees.get(aligne);
        if (lArticle && lArticle.listePJ) {
          $(this.node).on("click", () => {
            ObjetMenuContextuel.afficher({
              pere: aListe,
              initCommandes: function (aMenu) {
                lArticle.listePJ.parcourir((aDocument) => {
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
    });
  }
  avecDeploiementSurColonne(aParams) {
    return aParams.idColonne === DonneesListe_Dossiers.colonnes.evenement;
  }
  avecSelection() {
    return GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur;
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.publie: {
        return (
          !!this.autorisations.publie &&
          _estAutoriseAModifier.call(this, aParams.article)
        );
      }
    }
    return false;
  }
  avecEvenementSelectionDblClick(aParams) {
    return _estAutoriseAModifier.call(this, aParams.article);
  }
  avecSuppression(aParams) {
    return _estAutoriseAModifier.call(this, aParams.article);
  }
  suppressionConfirmation() {
    return false;
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    if (aParams.idColonne === DonneesListe_Dossiers.colonnes.pieceJointe) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.evenement:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_Dossiers.colonnes.accesRestreint:
      case DonneesListe_Dossiers.colonnes.publie:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_Dossiers.colonnes.pieceJointe:
      case DonneesListe_Dossiers.colonnes.interlocuteur:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getCouleurCellule(aParams) {
    if (!aParams.article.pere) {
      if (!this.avecEdition(aParams)) {
        return ObjetDonneesListe.ECouleurCellule.Deploiement;
      }
    }
  }
  getTri() {
    const tri = [];
    tri.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
    tri.push(ObjetTri.init("rang", EGenreTriElement.Decroissant));
    return ObjetTri.initRecursif("pere", tri);
  }
  fusionCelluleAvecColonnePrecedente(aParams) {
    return (
      !!aParams.article && aParams.article.estDossier && aParams.colonne < 5
    );
  }
  surEdition(aParams, V) {
    let lElement;
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.publie:
        aParams.article.publie = V;
        if (aParams.article.estDossier) {
          this.dossierCourant = aParams.article;
          for (let i = 0; i < this.dossierCourant.listeElements.count(); i++) {
            lElement = this.dossierCourant.listeElements.get(i);
            if (lElement.publie !== this.dossierCourant.publie) {
              lElement.publie = this.dossierCourant.publie;
              lElement.setEtat(EGenreEtat.Modification);
            }
          }
        } else {
          let nbPublies = 0;
          this.dossierCourant = aParams.article.pere;
          for (let j = 0; j < this.dossierCourant.listeElements.count(); j++) {
            lElement = this.dossierCourant.listeElements.get(j);
            if (lElement.publie) {
              nbPublies++;
            }
          }
          this.dossierCourant.publie = nbPublies > 0;
          this.dossierCourant.setEtat(EGenreEtat.Modification);
        }
        break;
    }
  }
  getValeur(aParams) {
    const H = [];
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.evenement:
        if (aParams.article.estDossier) {
          return composeElement.call(this, aParams);
        } else {
          H.push(`<div class="flex-contain full-width p-left-l" title="${aParams.article.titre}">\n          <div class="fluid-bloc">${aParams.article.getLibelle()}</div>\n          ${aParams.article.getGenre() === EGenreElementDossier.Communication ? `<div class="fix-bloc ${EGenreMediaUtil.getNomImage(aParams.article.element.type.Genre, aParams.article.avecReponseCourrier)}"></div>` : ``}
          </div>`);
          return H.join("");
        }
      case DonneesListe_Dossiers.colonnes.date:
        return aParams.article.estDossier ? "" : aParams.article.strDate;
      case DonneesListe_Dossiers.colonnes.responsable:
        return aParams.article.estDossier
          ? ""
          : aParams.article.element.respAdmin.getLibelle();
      case DonneesListe_Dossiers.colonnes.interlocuteur:
        if (aParams.article.estDiscussion) {
          if (aParams.article.listeInterlocuteurs.count() > 1) {
            return '<div class="Image_Messagerie_Groupe"></div>';
          } else {
            return aParams.article.listeInterlocuteurs.get(0).getLibelle();
          }
        } else {
          return aParams.article.estDossier
            ? ""
            : aParams.article.interlocuteur;
        }
      case DonneesListe_Dossiers.colonnes.complementInfo:
        return aParams.article.estDossier ? "" : aParams.article.commentaire;
      case DonneesListe_Dossiers.colonnes.pieceJointe:
        if (!!aParams.article.listePJ) {
          const lListePJSansEtat = aParams.article.listePJ.getListeElements(
            (aElement) => {
              return !!aElement && aElement.getEtat() === EGenreEtat.Aucun;
            },
          );
          if (lListePJSansEtat.count() > 0) {
            const lArrHint = [];
            lListePJSansEtat.parcourir((aPJ) => {
              lArrHint.push(aPJ.getLibelle());
            });
            const lStrHint = lArrHint.join(", ");
            if (lListePJSansEtat.count() === 1) {
              H.push(
                GChaine.composerUrlLienExterne({
                  libelleEcran:
                    '<div class="Image_Trombone" title="' +
                    lStrHint +
                    '"></div>',
                  documentJoint: lListePJSansEtat.get(0),
                  afficherIconeDocument: false,
                  genreRessource: EGenreRessource.DocJointEleve,
                }),
              );
            } else {
              H.push(
                '<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;" title="' +
                  lStrHint +
                  '" ' +
                  GHtml.composeAttr("ie-node", "nodePJ", aParams.ligne) +
                  "></div>",
              );
            }
          }
        }
        return H.join("");
      case DonneesListe_Dossiers.colonnes.accesRestreint:
        return aParams.article.estRestreint;
      case DonneesListe_Dossiers.colonnes.publie:
        return aParams.article.publie;
      case DonneesListe_Dossiers.colonnes.genre:
        return aParams.article.element.type.Genre;
      case DonneesListe_Dossiers.colonnes.rang:
        return aParams.article.rang;
      default:
    }
    return "";
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.accesRestreint:
        return aParams.article.hintRestriction;
    }
    return "";
  }
  getHintHtmlForce(aParams) {
    const lHint = [];
    switch (aParams.idColonne) {
      case DonneesListe_Dossiers.colonnes.interlocuteur:
        if (aParams.article.estDiscussion) {
          aParams.article.listeInterlocuteurs.parcourir((aInt) => {
            lHint.push(aInt.getLibelle());
          });
        }
        return aParams.article.estDiscussion ? lHint.join("<br/> ") : "";
    }
    return "";
  }
  avecMenuContextuel() {
    return GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur;
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel || !aParametres.article) {
      return;
    }
    const lDroitModification = _estAutoriseAModifier.call(
      this,
      aParametres.article,
    );
    if (!aParametres.article.estDecrochageScolaire) {
      if (aParametres.article.estDossier) {
        aParametres.menuContextuel.addCommande(
          DonneesListe_Dossiers.genreAction.modifierDossier,
          GTraductions.getValeur("dossierVieScolaire.Editer"),
          lDroitModification,
        );
        aParametres.menuContextuel.addCommande(
          DonneesListe_Dossiers.genreAction.supprimerDossier,
          GTraductions.getValeur("Supprimer"),
          lDroitModification,
        );
      } else {
        const lDroitEdition =
          lDroitModification &&
          aParametres.article.getGenre() === EGenreElementDossier.Communication;
        aParametres.menuContextuel.addCommande(
          DonneesListe_Dossiers.genreAction.modifierElement,
          GTraductions.getValeur("dossierVieScolaire.Editer"),
          lDroitEdition,
        );
        aParametres.menuContextuel.addCommande(
          DonneesListe_Dossiers.genreAction.supprimerElement,
          GTraductions.getValeur("Supprimer"),
          lDroitModification,
        );
      }
    }
  }
  evenementMenuContextuel(aParametres) {
    switch (aParametres.numeroMenu) {
      case DonneesListe_Dossiers.genreAction.modifierDossier:
        this.callbackmodifierDossier(aParametres.article);
        break;
      case DonneesListe_Dossiers.genreAction.supprimerDossier:
        this.callbacksupprimerDossier(aParametres.article);
        break;
      case DonneesListe_Dossiers.genreAction.modifierElement:
        this.callbackmodifierElement(aParametres.article);
        break;
      case DonneesListe_Dossiers.genreAction.supprimerElement:
        this.callbacksupprimerElement(aParametres.article);
        break;
      default:
    }
  }
}
DonneesListe_Dossiers.colonnes = {
  evenement: "evenement",
  date: "date",
  responsable: "responsable",
  interlocuteur: "interlocuteur",
  complementInfo: "complementInfo",
  pieceJointe: "pieceJointe",
  publie: "publie",
  estDossier: "estDossier",
  genre: "genre",
  rang: "rang",
  accesRestreint: "accesRestreint",
};
DonneesListe_Dossiers.genreAction = {
  modifierDossier: "modifierDossier",
  supprimerDossier: "supprimerDossier",
  modifierElement: "modifierElement",
  supprimerElement: "supprimerElement",
};
function _estAutoriseAModifier(aArticle) {
  let lDroitModification = false;
  if (!!aArticle && GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
    let lDossierCorrespondant = null;
    if (aArticle.estDossier) {
      lDossierCorrespondant = aArticle;
    } else {
      lDossierCorrespondant = aArticle.pere;
    }
    if (lDossierCorrespondant && lDossierCorrespondant.estDecrochageScolaire) {
      lDroitModification = this.autorisations.suiviDecrochage;
    } else if (!!lDossierCorrespondant) {
      const lEstDossierPerso =
        !!lDossierCorrespondant.respAdmin &&
        lDossierCorrespondant.respAdmin.getNumero() ===
          GEtatUtilisateur.getUtilisateur().getNumero();
      lDroitModification = lEstDossierPerso || this.autorisations.modifier;
    }
  }
  return lDroitModification;
}
function _getTitre(aDossier) {
  const H = [];
  const lString = [];
  if (aDossier.lieu.Libelle !== "") {
    lString.push(
      GTraductions.getValeur("dossierVieScolaire.fenetre.lieu"),
      " : ",
      aDossier.lieu.Libelle,
    );
  }
  if (aDossier.victime.Libelle !== "") {
    if (lString.length > 0) {
      lString.push(" - ");
    }
    lString.push(
      GTraductions.getValeur("dossierVieScolaire.fenetre.victime"),
      " : ",
      aDossier.victime.Libelle,
    );
  }
  if (aDossier.temoin.Libelle !== "") {
    if (lString.length > 0) {
      lString.push(" - ");
    }
    lString.push(
      GTraductions.getValeur("dossierVieScolaire.fenetre.temoin"),
      " : ",
      aDossier.temoin.Libelle,
    );
  }
  H.push('<span class="Gras">');
  if (aDossier.estDecrochageScolaire) {
    H.push(aDossier.titre);
  } else if (aDossier.listeMotifs) {
    let lElt;
    for (let i = 0; i < aDossier.listeMotifs.count(); i++) {
      lElt = aDossier.listeMotifs.get(i);
      if (i > 0) {
        H.push(", ");
      }
      H.push(lElt.getLibelle());
    }
    H.push(GDate.formatDate(aDossier.date, " - %JJ/%MM/%AA"));
  }
  H.push("</span>");
  if (lString.length > 0) {
    H.push(" - ", lString.join(""));
  }
  return H.join("");
}
function _openDocumentDArticle(aDocument) {
  window.open(
    GChaine.creerUrlBruteLienExterne(aDocument, {
      genreRessource: EGenreRessource.DocJointEleve,
    }),
  );
}
function composeElement(aParams) {
  const H = [];
  H.push(
    `<div class="flex-contain flex-center full-width p-y-s">\n            <div class="${aParams.article.deploye ? ` p-left-l` : ` p-left-xl m-left-s`}">`,
  );
  if (
    GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
    _estAutoriseAModifier.call(this, aParams.article)
  ) {
    H.push(
      `<ie-btnicon ${GHtml.composeAttr("ie-node", "nodeBtnAjouterElement", aParams.ligne)} class="icon_plus_cercle icone-m color-neutre m-right-l"></ie-btnicon>`,
    );
  }
  H.push(`</div>`);
  H.push(
    `<div class="fix-bloc ie-line-color static only-color var-height" style="--color-line : ${aParams.article.couleur};--var-height: 1.6rem;"></div>`,
  );
  H.push(`<div class="fluid-bloc flex-contain cols p-all">`);
  H.push(` <p>${_getTitre(aParams.article)}</p>`);
  H.push(` <p>${aParams.article.commentaire}</p>`);
  H.push(`</div>`);
  H.push(
    `<div class="self-end">${aParams.article && aParams.article.respAdmin ? aParams.article.respAdmin.getLibelle() : ""}</div>`,
  );
  H.push(`</div>`);
  return H.join("");
}
module.exports = { DonneesListe_Dossiers };
