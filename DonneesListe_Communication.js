const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_Communication extends ObjetDonneesListe {
  constructor(aDonnees, aOptionsAffichage) {
    const lAvecCumul = !!aOptionsAffichage.avecCumul;
    if (lAvecCumul) {
      const lListeArticlesDeploiement = new ObjetListeElements();
      aDonnees.parcourir((aElement) => {
        if (!!aElement.elementCumul) {
          let lArticleDeploiement =
            lListeArticlesDeploiement.getElementParNumero(
              aElement.elementCumul.getNumero(),
            );
          if (!lArticleDeploiement) {
            lArticleDeploiement = aElement.elementCumul;
            lArticleDeploiement.estUnDeploiement = true;
            lArticleDeploiement.estDeploye = true;
            lListeArticlesDeploiement.addElement(lArticleDeploiement);
          }
          aElement.pere = lArticleDeploiement;
        }
      });
      aDonnees.add(lListeArticlesDeploiement);
    }
    super(aDonnees);
    this.masquerDonneesInutiles = aOptionsAffichage.masquerDonneesInutiles;
    this.afficherAvecDiscussion = aOptionsAffichage.afficherAvecDiscussion;
    this.modeDiscussion = aOptionsAffichage.modeDiscussion;
    this.afficherInformationDelegue =
      aOptionsAffichage.afficherInformationDelegue;
    this.setOptions({
      avecDeploiement: lAvecCumul,
      avecImageSurColonneDeploiement: true,
      avecSelection: false,
      avecSuppression: false,
      avecEtatSaisie: false,
      avecEvnt_ApresEdition: true,
      avecEvnt_Selection: true,
    });
  }
  avecEdition(aParams) {
    return aParams.idColonne === DonneesListe_Communication.colonnes.coche;
  }
  getColonneTransfertEdition() {
    return DonneesListe_Communication.colonnes.coche;
  }
  avecEditionApresSelection() {
    return true;
  }
  surEdition(aParams, V) {
    if (aParams.idColonne === DonneesListe_Communication.colonnes.coche) {
      aParams.article.selection = V;
    }
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    if (aParams.article.estUnDeploiement) {
      lClasses.push("AvecMain");
    }
    return lClasses.join(" ");
  }
  getColonneDeFusion(aParams) {
    if (aParams.article.estUnDeploiement) {
      return DonneesListe_Communication.colonnes.nom;
    }
    return null;
  }
  getValeur(aParams) {
    const lValeur = [];
    switch (aParams.idColonne) {
      case DonneesListe_Communication.colonnes.coche:
        return !!aParams.article.selection;
      case DonneesListe_Communication.colonnes.nom:
        lValeur.push(aParams.article.getLibelle());
        if (!!aParams.article.estMonCpe) {
          lValeur.push(
            ' <div class="Gras"><i class="icon_star m-right-s"></i>' +
              GTraductions.getValeur("fenetreCommunication.monCPE") +
              "</div>",
          );
        }
        if (!!aParams.article.estPrincipal) {
          lValeur.push(
            ' <div class="Gras"><i class="icon_star m-right-s"></i>' +
              GTraductions.getValeur("fenetreCommunication.profPrincipal") +
              "</div>",
          );
        }
        if (!!aParams.article.estTuteur) {
          lValeur.push(
            ' <div class="Gras"><i class="icon_star m-right-s"></i>' +
              GTraductions.getValeur("fenetreCommunication.tuteur") +
              "</div>",
          );
        }
        if (aParams.article.estDelegue && this.afficherInformationDelegue) {
          lValeur.push(
            ' <div class="Gras">' +
              GTraductions.getValeur("fenetreCommunication.delegueDeClasse") +
              "</div>",
          );
        }
        if (!!aParams.article.delegueDesClasses) {
          lValeur.push(" (" + aParams.article.delegueDesClasses + ")");
        }
        return lValeur.join("");
      case DonneesListe_Communication.colonnes.image:
        if (this.afficherAvecDiscussion && aParams.article.avecDiscussion) {
          lValeur.push(
            '<div style="float:left;" class="Image_Destinataire_Message_Actif" title="',
            GTraductions.getValeur(
              "fenetreCommunication.colonne.discussionAutorisee",
            ),
            '"></div>',
          );
        }
        if (!!aParams.article.email) {
          lValeur.push(
            '<div style="float:left;" class="Image_Destinataire_Email_Actif" title="',
            GTraductions.getValeur(
              "fenetreCommunication.colonne.emailAutorise",
            ),
            '"></div>',
          );
        }
        return lValeur.join("");
      case DonneesListe_Communication.colonnes.autre:
        if (!!aParams.article.listeRessources) {
          aParams.article.listeRessources.parcourir((aRessource) => {
            lValeur.push("<div>");
            if (!!aRessource.estUneSousMatiere) {
              lValeur.push("&nbsp;&nbsp;&nbsp;&nbsp;");
            }
            lValeur.push(aRessource.getLibelle());
            lValeur.push("</div>");
          });
        } else if (aParams.article.fonction) {
          lValeur.push(aParams.article.fonction.getLibelle());
        }
        return lValeur.join("");
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Communication.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_Communication.colonnes.nom:
      case DonneesListe_Communication.colonnes.image:
      case DonneesListe_Communication.colonnes.autre:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getCouleurCellule(aParams) {
    if (aParams.article.estUnDeploiement) {
      return ObjetDonneesListe.ECouleurCellule.Deploiement;
    }
    return ObjetDonneesListe.ECouleurCellule.Blanc;
  }
  getVisible(aArticle) {
    if (this.modeDiscussion && this.masquerDonneesInutiles) {
      return !!aArticle.avecDiscussion;
    }
    return (
      !this.masquerDonneesInutiles ||
      aArticle.avecDiscussion ||
      !!aArticle.email
    );
  }
  getTri() {
    return [
      ObjetTri.initRecursif("pere", [
        ObjetTri.init("Position"),
        ObjetTri.init("Libelle"),
      ]),
    ];
  }
}
DonneesListe_Communication.colonnes = {
  coche: "DLCommunication_coche",
  nom: "DLCommunication_nom",
  image: "DLCommunication_image",
  autre: "DLCommunication_autre",
};
module.exports = { DonneesListe_Communication };
