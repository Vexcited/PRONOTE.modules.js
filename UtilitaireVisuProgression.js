exports.UtilitaireVisuProgression = void 0;
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Ressource_1 = require("Enumere_Ressource");
exports.UtilitaireVisuProgression = {
  composeProgression(aProgression) {
    if (!aProgression || !aProgression.listeDossiers) {
      return "";
    }
    return _composeDossiersEtElements(
      aProgression.listeDossiers,
      aProgression.listeContenus,
      1,
    );
  },
  composeDossierProgression(aListeContenus) {
    return _composeDossiersEtElements(null, aListeContenus, 1);
  },
};
function _composeElement(aElement, aAvecEspaceHaut) {
  if (!aElement.existe()) {
    return "";
  }
  const H = [];
  H.push('<li class="Texte10', aAvecEspaceHaut ? " EspaceHaut" : "", '">');
  let lDetail = "";
  if (
    aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.ContenuDeCours
  ) {
    if (aElement.categorie && aElement.categorie.getNumero()) {
      lDetail = aElement.categorie.getLibelle();
    }
  }
  H.push(
    '<span class="Gras">',
    lDetail ? lDetail + " - " : "",
    aElement.getLibelle() + "</span>",
  );
  if (aElement.descriptif) {
    H.push("<div>" + aElement.descriptif + "</div>");
  }
  if (aElement.ListePieceJointe) {
    H.push(
      "<div>" +
        UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
          aElement.ListePieceJointe,
          {
            genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
            separateur: "<br/>",
          },
        ) +
        "</div>",
    );
    H.push(
      "<div>" +
        UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
          aElement.ListePieceJointe,
          {
            genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
            separateur: "<br/>",
          },
        ) +
        "</div>",
    );
    H.push(
      "<div>" +
        UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
          aElement.ListePieceJointe,
          {
            genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
            separateur: "<br/>",
          },
        ) +
        "</div>",
    );
  }
  H.push("</li>");
  return H.join("");
}
function _composeDossier(aDossier, aNiveau, aAvecEspaceHaut) {
  if (!aDossier.existe()) {
    return "";
  }
  const H = [];
  H.push("<li", aAvecEspaceHaut ? ' class="EspaceHaut"' : "", ">");
  H.push('<span class="Gras">' + aDossier.getLibelle() + "</span>");
  H.push(
    _composeDossiersEtElements(
      aDossier.listeDossiers,
      aDossier.listeContenus,
      aNiveau + 1,
      true,
    ),
  );
  H.push("</li>");
  return H.join("");
}
function _composeDossiersEtElements(
  aListeDossiers,
  aListeContenus,
  aNiveau,
  aAvecEspaceHaut,
) {
  const H = [];
  let lTaille = 10;
  switch (aNiveau) {
    case 1:
      lTaille = 16;
      break;
    case 2:
      lTaille = 14;
      break;
    case 3:
      lTaille = 12;
      break;
  }
  if (aListeDossiers || aListeContenus) {
    H.push(
      '<ul style="margin: 0px; padding : 0px 0px 0px 20px;" class="Texte' +
        lTaille +
        '">',
    );
    let lAvecEspaceHaut = aAvecEspaceHaut;
    if (aListeDossiers) {
      aListeDossiers.parcourir((aDossier) => {
        if (aDossier.existe()) {
          H.push(_composeDossier(aDossier, aNiveau, lAvecEspaceHaut));
          lAvecEspaceHaut = true;
        }
      });
    }
    if (aListeContenus) {
      aListeContenus.parcourir((aElement) => {
        H.push(_composeElement(aElement, lAvecEspaceHaut));
        lAvecEspaceHaut = true;
      });
    }
    H.push("</ul>");
  }
  return H.join("");
}
