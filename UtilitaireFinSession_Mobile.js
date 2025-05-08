exports.UtilitaireFinSession_Mobile = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
class UtilitaireFinSession_Mobile {
  _construireEnTetePageFinSession(aParam) {
    const lHtml = [];
    lHtml.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "nav",
          { class: "nav-login" },
          IE.jsx.str(
            "div",
            { class: "nav-wrapper main-header" },
            IE.jsx.str(
              "div",
              { class: "header-gauche" },
              IE.jsx.str("div", { class: "masque-vide" }),
            ),
            IE.jsx.str(
              "div",
              { class: "header-droit" },
              IE.jsx.str(
                "div",
                { class: "infos-container", tabindex: "0" },
                IE.jsx.str(
                  "h1",
                  { class: "disable-dark-mode" },
                  aParam.nomEspace,
                ),
                IE.jsx.str(
                  "h2",
                  { class: "disable-dark-mode" },
                  aParam.nomEtablissement,
                ),
              ),
            ),
          ),
        ),
      ),
    );
    return lHtml.join("");
  }
  _construirePageFinSession(aParametres) {
    if (this._unloadEnCours) {
      return;
    }
    if (this.estAppliMobile) {
      window.messageData.push({ action: "finSession", data: aParametres });
      return;
    }
    const lCouleur = { texte: "black", fond: "white", bordure: "black" };
    const lParametresFin = {
      jsonErreur: null,
      statut: "",
      couleur: lCouleur,
      sansBoutonSeConnecter: false,
    };
    $.extend(lParametresFin, aParametres);
    let lTitre = null;
    let lMessage = null;
    let lGenreErreur;
    if (lParametresFin.jsonErreur) {
      lGenreErreur = lParametresFin.jsonErreur.G;
      lTitre = lParametresFin.jsonErreur.Titre;
      lMessage = lParametresFin.jsonErreur.Message;
    }
    lTitre =
      lTitre === null || lTitre === undefined
        ? ObjetTraduction_1.GTraductions.getValeur("connexion.PageIndisponible")
        : lTitre;
    lMessage =
      lMessage === null || lMessage === undefined
        ? ObjetTraduction_1.GTraductions.getValeur(
            "connexion.AffichagePageImpossible",
          )
        : lMessage;
    const lEstPrimaire = !!this.estPrimaire;
    const T = [];
    try {
      T.push(this.construireEnTetePageFinSession(lParametresFin));
    } catch (e) {}
    T.push(
      `<main class="deconnexion bg-mobile-${!lEstPrimaire ? this.nomProduit.toLowerCase() : `primaire`}">`,
    );
    T.push(`<div class="title-content">`);
    T.push(
      `<h3 class="logo_${this.nomProduit.toLowerCase()} ${lEstPrimaire ? ` primaire` : ""} "></h3>`,
    );
    T.push(
      "<h4>" +
        ObjetTraduction_1.GTraductions.getValeur("connexion.Deconnecter") +
        "</h4>",
      lTitre
        ? '<p class="pageDeconnexion_titre">' +
            lTitre +
            (lParametresFin.statut
              ? " (" +
                ObjetTraduction_1.GTraductions.getValeur("connexion.Erreur") +
                " " +
                lParametresFin.statut +
                ")"
              : "") +
            "</p>"
        : "",
      lMessage ? '<p class="message">' + lMessage + "</p>" : "",
      "</div>",
      lGenreErreur !== 7 && !lParametresFin.sansBoutonSeConnecter
        ? '<ie-bouton class="themeBoutonPrimaire" onkeyup="if (GNavigateur.isToucheSelection()) window.location.reload()" onclick="window.location.reload ()">' +
            ObjetTraduction_1.GTraductions.getValeur("connexion.SeConnecter") +
            "</ie-bouton>"
        : "",
      "</main>",
    );
    ObjetHtml_1.GHtml.setHtml(this.getIdConteneur(), T.join(""));
  }
}
exports.UtilitaireFinSession_Mobile = UtilitaireFinSession_Mobile;
