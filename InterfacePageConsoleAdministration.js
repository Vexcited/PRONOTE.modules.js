exports.InterfacePageConsoleAdministration = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetMenuOnglets_1 = require("ObjetMenuOnglets");
const ParametresAffichageDivers_1 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_2 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_3 = require("ParametresAffichageDivers");
const ParametresAffichageDivers_4 = require("ParametresAffichageDivers");
const ParametresAffichageMenuOnglets_1 = require("ParametresAffichageMenuOnglets");
const ObjetOnglet_1 = require("ObjetOnglet");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_Divers_1 = require("Enumere_Divers");
const Enumere_Onglet_Console_NET_1 = require("Enumere_Onglet_Console_NET");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const ParametresAffichageOnglet_1 = require("ParametresAffichageOnglet");
const MethodesObjet_1 = require("MethodesObjet");
var EProfilConnexion;
(function (EProfilConnexion) {
  EProfilConnexion[(EProfilConnexion["spr"] = 1)] = "spr";
  EProfilConnexion[(EProfilConnexion["ent"] = 2)] = "ent";
})(EProfilConnexion || (EProfilConnexion = {}));
class InterfacePageConsoleAdministration extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.objetApplicationConsoles = GApplication;
  }
  construireInstances() {
    this.identMenuOnglets = this.add(
      ObjetMenuOnglets_1.ObjetMenuOnglets,
      null,
      this.initialiserMenuOnglets,
    );
    this.identPage = this.add(ObjetInterface_1.ObjetInterface);
  }
  construireStructureAffichage() {
    const H = [];
    const lLargeurBordure = 1;
    const lHauteurMenuOnglets = 35 + lLargeurBordure;
    const lStyle = "height: 100%; overflow-y: scroll;";
    H.push(
      '<div style="position:absolute; top: ' +
        ObjetPosition_1.GPosition.getTop(this.Nom) +
        'px; width:100%; bottom:0px;">',
      this.identMenuOnglets >= 0
        ? '<div id="' +
            this.getInstance(this.identMenuOnglets).getNom() +
            '" style="height:32px" class="AlignementBas EspaceHaut"></div>'
        : "",
      this.identPage >= 0
        ? '<div style="position:absolute; top:' +
            lHauteurMenuOnglets +
            "px; bottom:0px; left:0px; right:0px;" +
            ObjetStyle_2.GStyle.composeCouleurFond(GCouleur.blanc) +
            ObjetStyle_2.GStyle.composeCouleurBordure(
              GCouleur.texte,
              lLargeurBordure,
              ObjetStyle_1.EGenreBordure.bas +
                ObjetStyle_1.EGenreBordure.droite +
                ObjetStyle_1.EGenreBordure.gauche,
            ) +
            ' min-height:50px;" ><div id="' +
            this.getInstance(this.identPage).getNom() +
            '" style="' +
            lStyle +
            '"></div></div>'
        : "",
      "</div>",
    );
    return H.join("");
  }
  evenementMenuOnglets(aParamOnglet) {
    this.objetApplicationConsoles.etatConsole.selectionCourante = aParamOnglet;
    this.getInstance(this.identMenuOnglets).setSelection(
      this.objetApplicationConsoles.etatConsole.selectionCourante.position,
    );
    if (this.existeInstance(this.identPage)) {
      this.getInstance(this.identPage).free();
    }
    this.Instances[this.identPage] = null;
    this.Instances[this.identPage] = this.creerPage(
      this.objetApplicationConsoles.etatConsole.selectionCourante.genre,
    );
    if (
      this.getInstance(this.identPage) instanceof
      ObjetInterface_1.ObjetInterface
    ) {
      this.getInstance(this.identPage).initialiser(true);
    } else {
      this.getInstance(this.identPage).initialiser();
    }
  }
  evenementPage() {
    this.callback.appel();
  }
  creerPage(aGenreOnglet) {
    return this.construireObjetGraphique(
      this.objetApplicationConsoles.getObjetGraphiqueParGenre(aGenreOnglet),
      this.identPage,
      this.evenementPage,
    );
  }
  initialiserMenuOnglets(aObjet) {
    const lTexteActif =
      new ParametresAffichageDivers_1.ParametresAffichageTexte("texte");
    lTexteActif.setCouleur(GCouleur.texte, GCouleur.blanc);
    lTexteActif.setTaillePolice(10);
    lTexteActif.setGras(false, true, true);
    lTexteActif.setSouligne(false, false);
    lTexteActif.setAlignementHorizontal(
      Enumere_Divers_1.EAlignementHorizontal.gauche,
    );
    const lActifCoinBordureSupGauche =
      new ParametresAffichageDivers_3.ParametresAffichageCoinBordure(
        "coinSuperieurGauche",
      );
    lActifCoinBordureSupGauche.setCouleur(GCouleur.texte, GCouleur.texte);
    lActifCoinBordureSupGauche.setEpaisseur(1);
    const lActifCoinBordureInfDroit =
      new ParametresAffichageDivers_3.ParametresAffichageCoinBordure(
        "coinInferieurDroit",
      );
    lActifCoinBordureInfDroit.setCouleur(GCouleur.texte, GCouleur.texte);
    lActifCoinBordureInfDroit.setEpaisseur(1);
    const lActifOnglet =
      new ParametresAffichageOnglet_1.ParametresAffichageOnglet(
        "parametresAffichageActif",
        200,
        20,
        GCouleur.intermediaire,
        lTexteActif,
        new ParametresAffichageDivers_2.ParametresAffichageBordure(
          "bordure",
          true,
          lActifCoinBordureSupGauche,
          lActifCoinBordureInfDroit,
        ),
      );
    lActifOnglet.setCouleur(
      GCouleur.blanc,
      GCouleur.texte,
      GCouleur.themeNeutre.moyen1,
    );
    const lParametresAffichage =
      new ParametresAffichageMenuOnglets_1.ObjetParametresAffichageMenuOnglets(
        "ParametresAffichageMenuOnglets",
        30,
        "white",
        Enumere_Divers_1.EAlignementHorizontal.gauche,
        Enumere_Divers_1.EOrientation.horizontal,
        new ParametresAffichageDivers_4.ParametresAffichageSeparateur(
          "separateur",
          true,
          "white",
        ),
        lActifOnglet,
        null,
      );
    aObjet.setParametres(lParametresAffichage);
  }
  getImagesOnglet(aGenre) {
    switch (aGenre) {
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication:
        return [
          "Image_Commande_ParametresPublication",
          "Image_Commande_ParametresPublication_Inactif",
        ];
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent:
        return [
          "Image_Commande_DeleguerAuthentification",
          "Image_Commande_DeleguerAuthentification_Inactif",
        ];
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
        .authentificationWsFed:
        return [
          "Image_Commande_DeleguerAuthentification",
          "Image_Commande_DeleguerAuthentification_Inactif",
        ];
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite:
        return [
          "Image_Commande_ParametresSecurite",
          "Image_Commande_ParametresSecurite_Inactif",
        ];
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
        .edtDansAutreSite:
        return [
          "Image_Commande_IntegrationEDT",
          "Image_Commande_IntegrationEDT_Inactif",
        ];
      case Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
        .panneauxLumineux:
        return [
          "Image_Commande_PanneauxLumineux",
          "Image_Commande_PanneauxLumineux_Inactif",
        ];
      default:
        return [
          "Image_Commande_ParametresPublication",
          "Image_Commande_ParametresPublication_Inactif",
        ];
    }
  }
  ongletAutorisePourProfil(aGenreOnglet) {
    return (
      ((aGenreOnglet !==
        Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent &&
        aGenreOnglet !==
          Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
            .authentificationWsFed) ||
        !this.objetApplicationConsoles.desactiverDelegationsAuthentification) &&
      (this.objetApplicationConsoles.getProfilConnexion() ===
        EProfilConnexion.spr ||
        (this.objetApplicationConsoles.getProfilConnexion() ===
          EProfilConnexion.ent &&
          aGenreOnglet ===
            Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent))
    );
  }
  controlerValiditeDuProfil() {
    let lTrouve = false;
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      EProfilConnexion,
    )) {
      if (
        this.objetApplicationConsoles.getProfilConnexion() ===
        EProfilConnexion[lKey]
      ) {
        lTrouve = true;
      }
    }
    if (!lTrouve) {
      this.objetApplicationConsoles.setProfilConnexion(EProfilConnexion.spr);
    }
  }
  recupererDonnees() {
    this.controlerValiditeDuProfil();
    const lGenreOngletDePosition = [
      Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication,
      Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent,
      Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.edtDansAutreSite,
      Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite,
      Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.panneauxLumineux,
    ];
    const lTabOnglets = [];
    let lPos = 0;
    for (let i = 0; i < lGenreOngletDePosition.length; i++) {
      const lGenreOnglet = lGenreOngletDePosition[i];
      if (
        this.ongletAutorisePourProfil(lGenreOnglet) &&
        this.objetApplicationConsoles.getObjetGraphiqueParGenre(lGenreOnglet)
      ) {
        const lOnglet = new ObjetOnglet_1.ObjetOnglet(
          this.getInstance(this.identMenuOnglets).getNom() + ".Instances",
          lPos,
          this,
          this.evenementMenuOnglets,
        );
        lOnglet.setParametres(
          ObjetTraduction_1.GTraductions.getValeur(
            "pageConsoleAdministration.onglets",
          )[lGenreOnglet],
          this.getImagesOnglet(lGenreOnglet),
          lGenreOnglet,
          lPos,
          ObjetTraduction_1.GTraductions.getValeur(
            "pageConsoleAdministration.hint",
          )
            ? ObjetTraduction_1.GTraductions.getValeur(
                "pageConsoleAdministration.hint",
              )[lGenreOnglet]
            : ObjetTraduction_1.GTraductions.getValeur(
                "pageConsoleAdministration.onglets",
              )[lGenreOnglet],
          true,
          true,
        );
        lTabOnglets.push(lOnglet);
        lPos++;
      }
    }
    this.getInstance(this.identMenuOnglets).setDonnees(lTabOnglets);
    this.getInstance(this.identMenuOnglets).afficher();
    this.evenementMenuOnglets(
      this.objetApplicationConsoles.etatConsole.selectionCourante,
    );
  }
}
exports.InterfacePageConsoleAdministration = InterfacePageConsoleAdministration;
