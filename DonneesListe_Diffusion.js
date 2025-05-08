const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { GChaine } = require("ObjetChaine.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ETypeAffEnModeMixte } = require("Enumere_MenuCtxModeMixte.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { tag } = require("tag.js");
class DonneesListe_Diffusion extends ObjetDonneesListeFlatDesign {
  constructor(aParams) {
    super(aParams.donnees);
    this.callbackMenuContextuel = aParams.evenementMenuContextuel;
    this.uniquementMesListes = aParams.uniquementMesListes || false;
    this.creerIndexUnique(["Libelle", "libelleAuteur"]);
    this.setOptions({
      avecEvnt_Selection: true,
      avecEvnt_ApresSuppression: true,
    });
  }
  setUniquementMesListes(aUniquementMesListes) {
    this.uniquementMesListes = aUniquementMesListes;
  }
  getVisible(aArticle) {
    return !this.uniquementMesListes || aArticle.estAuteur;
  }
  avecEvenementApresErreurCreation() {
    return true;
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle() || "";
  }
  getInfosSuppZonePrincipale(aParams) {
    const H = [];
    if (aParams.article && aParams.article.libelleAuteur) {
      H.push(
        tag("div", { class: ["diff_auteur"] }, aParams.article.libelleAuteur),
      );
    }
    return H.join("");
  }
  avecSuppression(aArticle) {
    return this.options.avecSuppression && aArticle.estAuteur;
  }
  getZoneComplementaire(aParams) {
    return tag("div", { class: ["icones-conteneur", "tiny"] }, () => {
      if (aParams.article.estPublique) {
        const lTexte = GTraductions.getValeur("listeDiffusion.hintpartage");
        return tag("i", {
          class: "icon_sondage_bibliotheque",
          title: GChaine.toTitle(lTexte),
          "aria-label": lTexte,
        });
      }
    });
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (aParametres.article && aParametres.article.estAuteur) {
      if (GApplication.droits.get(TypeDroits.listeDiffusion.avecPublication)) {
        const lTitre = aParametres.article.estPublique
          ? GTraductions.getValeur("listeDiffusion.nepaspartager")
          : GTraductions.getValeur("listeDiffusion.partager");
        const lAction = aParametres.article.estPublique
          ? DonneesListe_Diffusion.genreAction.departager
          : DonneesListe_Diffusion.genreAction.partager;
        const lIcon = aParametres.article.estPublique
          ? "icon_retirer_bibliotheque"
          : "icon_sondage_bibliotheque";
        aParametres.menuContextuel.add(
          lTitre,
          true,
          (aItemMenu) => {
            if (aItemMenu && aItemMenu.data) {
              aItemMenu.data.estPublique = !aItemMenu.data.estPublique;
              aItemMenu.data.setEtat(EGenreEtat.Modification);
              this.callbackMenuContextuel(aItemMenu);
            }
          },
          {
            icon: lIcon + " i-small",
            Numero: lAction,
            typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
            data: aParametres.article,
          },
        );
      }
      aParametres.menuContextuel.add(
        GTraductions.getValeur("listeDiffusion.renommer"),
        true,
        (aItemMenu) => {
          this.callbackMenuContextuel(aItemMenu);
        },
        {
          icon: "icon_pencil i-small",
          Numero: DonneesListe_Diffusion.genreAction.renommer,
          typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
          data: aParametres.article,
        },
      );
    }
    aParametres.menuContextuel.add(
      GTraductions.getValeur("liste.supprimer"),
      aParametres.article.estAuteur,
      (aItemMenu) => {
        if (aItemMenu && aItemMenu.data) {
          const lMsgConfirmSuppression = GTraductions.getValeur(
            "liste.suppressionSelection",
          );
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: lMsgConfirmSuppression,
            callback: (aGenreAction) => {
              if (aGenreAction === EGenreAction.Valider) {
                aItemMenu.data.setEtat(EGenreEtat.Suppression);
                this.callbackMenuContextuel(aItemMenu);
              }
            },
          });
        }
      },
      {
        icon: "icon_trash",
        Numero: EGenreCommandeMenu.Suppression,
        typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
        data: aParametres.article,
      },
    );
    aParametres.menuContextuel.addSeparateur();
    if (!IE.estMobile) {
      if (GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)) {
        aParametres.menuContextuel.add(
          GTraductions.getValeur("actualites.creerInfo"),
          true,
          (aArticle) => {
            if (aArticle) {
              this.callbackMenuContextuel(aArticle);
            }
          },
          {
            icon: "icon_diffuser_information i-small",
            Numero: DonneesListe_Diffusion.genreAction.diffuserInformation,
            typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
            data: aParametres.article,
          },
        );
      }
      if (GApplication.droits.get(TypeDroits.communication.avecDiscussion)) {
        aParametres.menuContextuel.add(
          GTraductions.getValeur("actualites.discussion.demarrer"),
          true,
          (aArticle) => {
            if (aArticle) {
              this.callbackMenuContextuel(aArticle);
            }
          },
          {
            icon: "icon_nouvelle_discussion i-small",
            Numero: DonneesListe_Diffusion.genreAction.demarrerDiscussion,
            typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
            data: aParametres.article,
          },
        );
      }
      if (GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)) {
        aParametres.menuContextuel.add(
          GTraductions.getValeur("actualites.creerSondage"),
          true,
          (aArticle) => {
            if (aArticle) {
              this.callbackMenuContextuel(aArticle);
            }
          },
          {
            icon: "icon_diffuser_sondage i-small",
            Numero: DonneesListe_Diffusion.genreAction.effectuerSondage,
            typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
            data: aParametres.article,
          },
        );
      }
    }
  }
  evenementMenuContextuel(aParametres) {
    this.callbackMenuContextuel(aParametres.ligneMenu);
  }
}
DonneesListe_Diffusion.genreAction = {
  diffuserInformation: 1,
  demarrerDiscussion: 2,
  effectuerSondage: 3,
  partager: 4,
  departager: 5,
  renommer: 6,
  ajouterpublic: 7,
};
module.exports = { DonneesListe_Diffusion };
