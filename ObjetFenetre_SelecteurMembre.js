exports.ObjetFenetre_SelecteurMembre = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_SelecteurMembre_1 = require("DonneesListe_SelecteurMembre");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_SelecteurMembre extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.interfaceMobile = GInterface;
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
  }
  composeContenu() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str("div", {
        class: "full-height",
        id: this.getNomInstance(this.identListe),
      }),
    );
  }
  setDonnees(aParams) {
    const lBoutons = [];
    if (aParams.listeRessources.count() >= aParams.nbreRecherche) {
      lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
    }
    this.getInstance(this.identListe).setOptionsListe({ boutons: lBoutons });
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SelecteurMembre_1.DonneesListe_SelecteurMembre(
        aParams.listeRessources,
      ),
    );
  }
  evenementSurListe(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
        if (aParametres.article.pourAppli) {
          window.messageData.push({ action: "changerProfil" });
        } else {
          this.interfaceMobile.changementRessource(aParametres.ligne);
        }
        this.fermer();
        break;
    }
  }
  initialiserListe(aInstance) {
    aInstance.setOptionsListe({
      skin: ObjetListe_1.ObjetListe.skin.flatDesign,
      hauteurAdapteContenu: true,
    });
  }
  static ouvrir() {
    var _a;
    const lApplicationScoMobile = GApplication;
    const lMiniPourRecherche = 10;
    const lListeRessources = MethodesObjet_1.MethodesObjet.dupliquer(
      lApplicationScoMobile.getInterfaceMobile().getListeRessources(),
    );
    if (
      GApplication.estAppliMobile &&
      ((_a =
        lApplicationScoMobile === null || lApplicationScoMobile === void 0
          ? void 0
          : lApplicationScoMobile.profilsApp) === null || _a === void 0
        ? void 0
        : _a.length) > 1
    ) {
      const lLibelle = `${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.ChangerCompte")} (${lApplicationScoMobile.profilsApp.length})`;
      const lCompteAppli = new ObjetElement_1.ObjetElement(lLibelle);
      lCompteAppli.pourAppli = true;
      lListeRessources.add(lCompteAppli);
    }
    let lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelecteurMembre,
      {
        pere: this,
        initialiser: function (aInstance) {
          aInstance.setOptionsFenetre({
            avecScroll: true,
            heightMax_mobile: lListeRessources.count() >= lMiniPourRecherche,
          });
        },
      },
    );
    lFenetre.afficher();
    lFenetre.setDonnees({
      listeRessources: lListeRessources,
      nbreRecherche: lMiniPourRecherche,
    });
  }
}
exports.ObjetFenetre_SelecteurMembre = ObjetFenetre_SelecteurMembre;
