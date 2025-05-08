exports.ObjetFenetre_MentionsLegales = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
class ObjetFenetre_MentionsLegales extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idContenu = this.getNom() + "_Contenu";
    this.setOptionsFenetre({
      largeur: 450,
      hauteur: 320,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
    });
  }
  composerContenu(aParametres) {
    const H = [];
    H.push(
      IE.jsx.str(
        "p",
        { class: "ie-titre-petit PetitEspaceBas" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.adresseEtablissement",
        ),
      ),
    );
    H.push(
      aParametres.adresseEtablissement &&
        IE.jsx.str("p", null, aParametres.adresseEtablissement),
    );
    H.push(
      IE.jsx.str(
        "p",
        { class: "GrandEspaceHaut ie-titre-petit PetitEspaceBas" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.formeJuridique",
        ),
      ),
    );
    H.push(
      aParametres.formeJuridique &&
        IE.jsx.str("p", null, aParametres.formeJuridique),
    );
    H.push(
      IE.jsx.str(
        "p",
        { class: "GrandEspaceHaut ie-titre-petit PetitEspaceBas" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.hebergeur",
        ),
      ),
    );
    H.push(
      aParametres.hebergeur && IE.jsx.str("p", null, aParametres.hebergeur),
    );
    H.push(
      IE.jsx.str(
        "p",
        { class: "GrandEspaceHaut ie-titre-petit PetitEspaceBas" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.responsablePublication",
        ),
      ),
    );
    H.push(
      aParametres.responsablePublication &&
        IE.jsx.str("p", null, aParametres.responsablePublication),
    );
    if (!!aParametres.informationsComplementaires) {
      H.push(
        IE.jsx.str(
          "p",
          { class: "GrandEspaceHaut ie-titre-petit PetitEspaceBas" },
          ObjetTraduction_1.GTraductions.getValeur(
            "FenetreMentionsLegales.informationsComplementaires",
          ),
        ),
      );
      H.push(aParametres.informationsComplementaires);
    }
    H.push(
      IE.jsx.str(
        "h2",
        { class: "ie-titre m-top-xxl m-bottom-xl" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.utilisationCookie",
        ),
      ),
    );
    H.push(
      IE.jsx.str(
        "p",
        null,
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.informationCookie",
          [GApplication.nomProduit],
        ),
        " ",
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.informationCookieSuite",
          [GApplication.nomProduit],
        ),
      ),
    );
    H.push(
      IE.jsx.str(
        "p",
        { class: "m-y" },
        ObjetTraduction_1.GTraductions.getValeur(
          "FenetreMentionsLegales.utilisationCookieTitre",
        ),
      ),
    );
    H.push(
      IE.jsx.str(
        "ul",
        { class: "dot m-left xl" },
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur(
            "FenetreMentionsLegales.utilisationCookieCASTGC",
          ),
        ),
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur(
            "FenetreMentionsLegales.utilisationCookieLang",
          ),
        ),
      ),
    );
    return H.join("");
  }
  setDonnees(aParam) {
    ObjetHtml_1.GHtml.setHtml(this.idContenu, this.composerContenu(aParam));
    this.afficher();
  }
  composeContenu() {
    return IE.jsx.str("div", { id: this.idContenu });
  }
  surValidation() {
    this.fermer();
  }
}
exports.ObjetFenetre_MentionsLegales = ObjetFenetre_MentionsLegales;
