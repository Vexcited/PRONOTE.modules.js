exports.InterfaceForumPedagogique_Mobile = void 0;
const InterfaceForumPedagogique_1 = require("InterfaceForumPedagogique");
const ObjetFenetre_SaisieSujetForumPedagogique_1 = require("ObjetFenetre_SaisieSujetForumPedagogique");
const ObjetFenetre_1 = require("ObjetFenetre");
class InterfaceForumPedagogique_Mobile extends InterfaceForumPedagogique_1.InterfaceForumPedagogique {
  constructor(...aParams) {
    super(...aParams);
    this.moteurForum.setOptions({
      surBasculeEcran: (aSurPosts) => {
        const lListeSujets = this.getInstance(this.identListeSujets);
        lListeSujets.setVisible(!aSurPosts);
        this.getInstance(this.identPosts).setVisible(!!aSurPosts);
        if (!aSurPosts) {
          lListeSujets.selectionnerLigne({ deselectionnerTout: true });
        }
      },
      ouvrirEditionSujetPromise: (aSujet, aSurCreation) => {
        return ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_SaisieSujetForumPedagogique_1.ObjetFenetre_SaisieSujetForumPedagogique,
          {
            pere: this,
            initialiser(aFenetre) {
              aFenetre
                .setOptionsFenetre({ moteurForum: this.moteurForum })
                .setSujet(aSujet, aSurCreation);
            },
          },
        ).afficher();
      },
    });
  }
}
exports.InterfaceForumPedagogique_Mobile = InterfaceForumPedagogique_Mobile;
