const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const {
  ModeleDetailProgrammationPunition,
} = require("DetailProgrammationPunition.tsxModele.js");
const { tag } = require("tag.js");
class ObjetFenetre_ProgrammationPunition extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      modale: false,
      largeurMin: 500,
      avecScroll: true,
      hauteurMaxContenu: 500,
      callback: function (aNumeroBouton, aParams) {
        if (aParams.bouton && aParams.bouton.navigation) {
          aParams.bouton.navigation();
        }
      },
    });
  }
  setDonnees(aParametres) {
    const lParametres = Object.assign({ titre: "", liste: null }, aParametres);
    const lListeBoutons = [
      { libelle: GTraductions.getValeur("Fermer"), fermer: true },
    ];
    const lOnglet = GEtatUtilisateur.listeOnglets.getElementParGenre(
      EGenreOnglet.Saisie_Punitions,
    );
    if (lOnglet && lOnglet.Actif && lParametres.punition) {
      lListeBoutons.push({
        libelle: GTraductions.getValeur(
          "ObjetFenetre_ProgrammationPunition.VoirLeDetail",
        ),
        navigation: function () {
          GEtatUtilisateur.setNrPunitionSelectionnee(
            lParametres.punition.getNumero(),
          );
          GInterface.changementManuelOnglet(EGenreOnglet.Saisie_Punitions);
        },
      });
    }
    this.setOptionsFenetre({
      titre: lParametres.titre,
      listeBoutons: lListeBoutons,
    });
    const H = [];
    if (lParametres.liste && lParametres.liste.length > 0) {
      lParametres.liste.forEach((aProgrammation, aIndex) => {
        if (lParametres.liste.length > 1 && aProgrammation.nom) {
          H.push(
            tag(
              "div",
              {
                class: ["p-all m-all", aIndex >= 1 ? "m-top-l" : ""],
                style: "background-color:var(--theme-neutre-moyen1);",
              },
              aProgrammation.nom,
            ),
          );
        }
        H.push(
          ModeleDetailProgrammationPunition.getHtml({
            details: aProgrammation,
            circonstances: GChaine.replaceRCToHTML(
              aProgrammation.circonstances,
            ),
            commentaire: aProgrammation.commentaire
              ? GChaine.replaceRCToHTML(aProgrammation.commentaire)
              : "",
            styleMaxTaille: "max-width : 600px;max-height : 200px;",
          }),
        );
      });
    }
    this.afficher(H.join(""));
    return this;
  }
}
module.exports = { ObjetFenetre_ProgrammationPunition };
