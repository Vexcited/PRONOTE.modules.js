exports.DonneesListe_SelectEtiquettes = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const TypeOrigineCreationEtiquetteMessage_1 = require("TypeOrigineCreationEtiquetteMessage");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const tag_1 = require("tag");
const ObjetListe_1 = require("ObjetListe");
class DonneesListe_SelectEtiquettes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aListe, aParametres) {
    super(aListe);
    this.parametres = Object.assign(
      { listeMessages: null, moteurMessagerie: null },
      aParametres,
    );
    aListe.parcourir((aArticle) => {
      if (aArticle.cumulEtiquettePerso) {
        aArticle.estDeploye = DonneesListe_SelectEtiquettes.categoriesDeployees;
      }
    });
    this.setOptions({
      avecTri: false,
      avecDeselectionSurNonSelectionnable: false,
      flatDesignMinimal: true,
      avecBoutonActionLigne: false,
      avecIndentationSousInterTitre: true,
    });
  }
  getZoneGauche(aParams) {
    if (aParams.article.estSansEtiquette) {
      return (0, tag_1.tag)("div", {
        class: "utilMess_etiquette sans-etiquette",
      });
    }
    if (
      !aParams.article.categories &&
      !UtilitaireMessagerie_1.UtilitaireMessagerie.getIconeDEtiquette(
        aParams.article,
      )
    ) {
      return UtilitaireMessagerie_1.UtilitaireMessagerie.construireImageEtiquette(
        aParams.article,
      ).icone;
    }
  }
  getIconeGaucheContenuFormate(aParams) {
    if (aParams.article.categories) {
      return "icon_plus_cercle";
    }
    const lIcone =
      UtilitaireMessagerie_1.UtilitaireMessagerie.getIconeDEtiquette(
        aParams.article,
      );
    return lIcone || "";
  }
  getTitreZonePrincipale(aParams) {
    const lLibelle = aParams.article.getLibelle();
    if (aParams.article.cumulEtiquettePerso) {
      return (0, tag_1.tag)(
        "div",
        {
          class: [
            "fd-style-intertitre",
            ObjetListe_1.ObjetListe.typeInterTitre.h5,
          ],
        },
        lLibelle,
      );
    }
    return lLibelle;
  }
  getZoneComplementaire(aParams) {
    if (aParams.article.categories) {
      return "";
    }
    const lCompteurMessagesNonLues =
      UtilitaireMessagerie_1.UtilitaireMessagerie.getNbNonlusDEtiquette(
        aParams.article,
        this.parametres.listeMessages,
      );
    const lResultImageEtiquette =
      UtilitaireMessagerie_1.UtilitaireMessagerie.construireImageEtiquette(
        aParams.article,
      );
    let lLibelleCompteur = "";
    const lCompteur = lCompteurMessagesNonLues;
    if (lCompteur > 0) {
      lLibelleCompteur =
        '<div class="compteur ' +
        (lResultImageEtiquette.avecCompteurNonLu ? " Gras" : "") +
        '">' +
        lCompteur +
        "</div>";
    }
    return lLibelleCompteur;
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (
      aZone ===
      ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
        .ZoneCelluleFlatDesign.zoneComplementaire
    ) {
      const lCompteurMessagesNonLues =
        UtilitaireMessagerie_1.UtilitaireMessagerie.getNbNonlusDEtiquette(
          aParams.article,
          this.parametres.listeMessages,
        );
      if (lCompteurMessagesNonLues > 1) {
        return ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.XMessagesNonLus_D",
          lCompteurMessagesNonLues,
        );
      }
      if (lCompteurMessagesNonLues === 1) {
        return ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.1MessageNonLu",
        );
      }
    }
    return "";
  }
  avecSelection(aParams) {
    return !aParams.article.nonSelectionnable;
  }
  avecEvenementSelection(aParams) {
    return !aParams.article.nonSelectionnable || aParams.article.categories;
  }
  surDeploiement(I, J, aArticle) {
    super.surDeploiement(I, J, aArticle);
    if (aArticle.cumulEtiquettePerso) {
      DonneesListe_SelectEtiquettes.categoriesDeployees = aArticle.estDeploye;
    }
  }
  remplirMenuContextuel(aParametres) {
    if (
      aParametres.menuContextuel &&
      aParametres.article.getGenre() ===
        TypeOrigineCreationEtiquetteMessage_1
          .TypeOrigineCreationEtiquetteMessage.OCEM_Pre_Poubelle &&
      this.parametres.moteurMessagerie &&
      GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
      )
    ) {
      const lNb =
        this.parametres.moteurMessagerie.getNbMessagesSupprimablesPoubelle();
      aParametres.menuContextuel.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.Menu_ViderCorbeille",
        ),
        lNb > 0,
        () => {
          this.parametres.moteurMessagerie.saisieViderCorbeille(lNb);
        },
      );
    }
  }
}
exports.DonneesListe_SelectEtiquettes = DonneesListe_SelectEtiquettes;
DonneesListe_SelectEtiquettes.categoriesDeployees = true;
