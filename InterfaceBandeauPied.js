const { _ObjetAffichageBandeauPied } = require("_InterfaceBandeauPied.js");
const { EGenreCommande } = require("Enumere_Commande.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireRedirection } = require("UtilitaireRedirection.js");
class ObjetAffichageBandeauPied extends _ObjetAffichageBandeauPied {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      mention: GParametres.publierMentions,
      siteIndex:
        GParametres.urlSiteIndexEducation || "https://www.index-education.com",
      urlInfosHebergement: GParametres.urlInfosHebergement,
      logoProduitCss: GParametres.logoProduitCss || "",
      estHebergeEnFrance: GParametres.estHebergeEnFrance,
      pageEtablissement: GParametres.PageEtablissement || "",
      avecBoutonMasquer: true,
      urlDeclarationAccessibilite: GParametres.urlDeclarationAccessibilite,
      accessibiliteNonConforme: GParametres.accessibiliteNonConforme,
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      nodeCanope: function () {
        $(this.node).eventValidation(() => {
          window.open(GParametres.urlCanope);
        });
      },
      nodePageEtab: function () {
        $(this.node).eventValidation(() => {
          let lUrl = window.location.href.split("/");
          lUrl.pop();
          lUrl = lUrl.join("/") + "/";
          window.open(
            lUrl +
              aInstance.options.pageEtablissement +
              new UtilitaireRedirection().getParametresUrl(),
          );
        });
      },
    });
  }
  getCommande(aGenreCommande) {
    switch (aGenreCommande) {
      case this.genreCommande.forum:
        return EGenreCommande.Forum;
      case this.genreCommande.twitter:
        return EGenreCommande.Twitter;
      case this.genreCommande.videos:
        return EGenreCommande.Videos;
      case this.genreCommande.profil:
        return EGenreCommande.Profil;
      case this.genreCommande.communication:
        return EGenreCommande.Communication;
      default:
        return false;
    }
  }
  evenementBouton(aParam, aGenreBouton) {
    if (aParam.genreCmd === this.getCommande(this.genreCommande.twitter)) {
      if (!!GParametres.urlAccesTwitter) {
        window.open(GParametres.urlAccesTwitter);
      }
      return;
    }
    return super.evenementBouton(aParam, aGenreBouton);
  }
  avecTwitter() {
    return (
      GApplication.droits.get(TypeDroits.fonctionnalites.gestionTwitter) &&
      !!GParametres.urlAccesTwitter
    );
  }
  avecPlanSite() {
    return true;
  }
  avecBoutonAccesProfil() {
    return (
      !GNavigateur.isIOS &&
      GEtatUtilisateur.GenreEspace !== EGenreEspace.Inscription
    );
  }
  composeBoutonAccesProfil() {
    const H = [];
    const lStrTuto = GApplication.estEDT
      ? GTraductions.getValeur("PiedPage.tutosForum")
      : GTraductions.getValeur("PiedPage.tutosForumQCM");
    H.push(
      '<div role="button" tabindex="0" class="ibp-pill icon_light_bulb" ie-node="nodePied(' +
        this.getCommande(this.genreCommande.profil) +
        ')" ie-hint="',
      lStrTuto,
      " : ",
      '">',
      '<div class="kb-conteneur">',
      '<p class="as-title">',
      GTraductions.getValeur("PiedPage.toutSavoirPronote"),
      "</p>",
      "<p>",
      lStrTuto,
      "</p>",
      "</div>",
      "</div>",
    );
    return H.join("");
  }
  avecBoutonPersonnaliseProduit() {
    return (
      !GNavigateur.isIOS &&
      [
        EGenreEspace.Professeur,
        EGenreEspace.Mobile_Professeur,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Mobile_PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.Mobile_PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace) &&
      GParametres.estHebergeEnFrance &&
      !!GParametres.urlCanope
    );
  }
  composeBoutonPersonnaliseProduit() {
    const H = [];
    H.push(
      '<div class="ibp-pill partenaire-canope" ie-node="nodeCanope" ie-hint="',
      GTraductions.getValeur("PiedPage.Canope"),
      '"><ie-btnimage class="btnImageIcon Image_Partenaire_Canope_2022" role="button" tabindex="0" aria-label="',
      GTraductions.getValeur("PiedPage.Canope"),
      '"></ie-btnimage></div>',
    );
    return H.join("");
  }
  avecBoutonPageEtablissement() {
    return !!this.options.pageEtablissement;
  }
  composeBoutonPageEtablissement() {
    const H = [];
    H.push(
      '<div tabindex="0" role="button" class="ibp-pill icon_ecole" aria-label="',
      GTraductions.getValeur("PiedPage.PageEtablissement"),
      '" ie-node="nodePageEtab" ie-hint="',
      GTraductions.getValeur("PiedPage.PageEtablissement"),
      '"><p class="help-text">',
      GTraductions.getValeur("PiedPage.PageEtablissement"),
      "</p></a></div>",
    );
    return H.join("");
  }
  espacesISO27001() {
    return !GEtatUtilisateur.pourPrimaire();
  }
}
module.exports = ObjetAffichageBandeauPied;
