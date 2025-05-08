const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const UtilitaireListePublics = {};
UtilitaireListePublics.getLibelleSuppListePublics = (
  aArticle,
  aOptions = {},
) => {
  const lOptions = Object.assign(
    {
      avecProfPrincipal: false,
      avecTuteur: false,
      avecListeRessource: false,
      avecReferentHarcelement: true,
      avecMonCpe: true,
      avecFonction: true,
    },
    aOptions,
  );
  const H = [];
  if (aArticle) {
    switch (aArticle.getGenre()) {
      case EGenreRessource.Enseignant:
        if (lOptions.avecProfPrincipal && aArticle.estPrincipal) {
          H.push(
            `<p><i class="icon_star m-right-s"></i>${GTraductions.getValeur("Messagerie.ProfPrincipal")}</p>`,
          );
        }
        if (lOptions.avecTuteur && aArticle.estTuteur) {
          H.push(
            `<p><i class="icon_star m-right-s"></i>${GTraductions.getValeur("Messagerie.Tuteur")}</p>`,
          );
        }
        if (lOptions.avecListeRessource && aArticle.listeRessources) {
          H.push(aArticle.listeRessources.getTableauLibelles().join("<br>"));
        }
        break;
      case EGenreRessource.Personnel:
        if (lOptions.avecMonCpe && aArticle.estMonCpe) {
          H.push(
            `<p><i class="icon_star m-right-s"></i>${GTraductions.getValeur("Messagerie.monCPE")}</p>`,
          );
        }
        if (lOptions.avecFonction && aArticle.fonction) {
          H.push(`<p>${aArticle.fonction.getLibelle()}</p>`);
        }
        break;
      case EGenreRessource.Eleve:
      case EGenreRessource.Responsable:
        if (aArticle.classesNiv) {
          H.push(
            `<p>${aArticle.classesNiv.getTableauLibelles().join(", ")}</p>`,
          );
        }
    }
  }
  return H.join("");
};
module.exports = { UtilitaireListePublics };
