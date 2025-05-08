const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  EGenreRessourcePedagogique,
  EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
class DonneesListe_RessourcesPedagogiques extends ObjetDonneesListe {
  constructor(aDonnees, aGenresAffiches, aCallbackExecutionQCM) {
    super(aDonnees.ensembleDocuments);
    aDonnees.ensembleDocuments.parcourir((D) => {
      D.visible = D.genres.dupliquer().intersect(aGenresAffiches).count() > 0;
    });
    this.callbackExecutionQCM = aCallbackExecutionQCM;
    this.setOptions({
      hauteurMinCellule: 30,
      avecSelection: false,
      avecEdition: false,
    });
  }
  getControleur(aInstanceDonneesListe, aInstanceListe) {
    return $.extend(
      true,
      super.getControleur(aInstanceDonneesListe, aInstanceListe),
      {
        eventLigne: function (aLigne) {
          const lElement = aInstanceDonneesListe.Donnees.get(aLigne);
          if (
            lElement &&
            (lElement.genres.contains(EGenreRessourcePedagogique.QCM) ||
              lElement.genres.contains(EGenreRessourcePedagogique.corrige))
          ) {
            aInstanceDonneesListe.callbackExecutionQCM(lElement.ressource);
          } else {
          }
        },
      },
    );
  }
  avecEvenementSelection(aParams) {
    return (
      aParams.idColonne ===
        DonneesListe_RessourcesPedagogiques.colonnes.libelle &&
      aParams.article.getGenre() === EGenreRessourcePedagogique.kiosque
    );
  }
  getClass(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiques.colonnes.types:
        lClasses.push("AlignementMilieu");
        break;
      case DonneesListe_RessourcesPedagogiques.colonnes.date:
        lClasses.push("AlignementDroit");
        break;
    }
    return lClasses.join(" ");
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiques.colonnes.types:
      case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    const H = [];
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiques.colonnes.types: {
        const lItems = aParams.article.genres.items();
        for (let i = 0; i < lItems.length; i++) {
          H.push(
            '<i class="' +
              EGenreRessourcePedagogiqueUtil.getIcone(lItems[i]) +
              '" style="font-size:1.6rem;"></i>',
          );
        }
        return H.join(" ");
      }
      case DonneesListe_RessourcesPedagogiques.colonnes.matiere:
        return aParams.article.matiere
          ? aParams.article.matiere.getLibelle()
          : "";
      case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
        if (aParams.article.getGenre() === EGenreRessourcePedagogique.QCM) {
          if (UtilitaireQCM.estCliquable(aParams.article.ressource)) {
            H.push(
              '<span class="LienAccueil" ie-event="mouseup->eventLigne(',
              aParams.ligne,
              ')">',
              aParams.article.ressource.QCM.getLibelle(),
              "</span>",
            );
          } else {
            H.push(
              '<span class="Texte10">',
              aParams.article.ressource.QCM.getLibelle(),
              "</span>",
            );
          }
          return H.join("");
        } else {
          H.push(
            EGenreRessourcePedagogiqueUtil.composerURL(
              aParams.article.getGenre(),
              aParams.article.ressource,
              aParams.article.getGenre() ===
                EGenreRessourcePedagogique.travailRendu
                ? GTraductions.getValeur("RessourcePedagogique.DevoirDu", [
                    GDate.formatDate(
                      aParams.article.ressource.pourLe,
                      "%JJ/%MM/%AA",
                    ),
                  ])
                : null,
            ),
          );
          return H.join("");
        }
      case DonneesListe_RessourcesPedagogiques.colonnes.date: {
        let lDate = aParams.article.date;
        if (aParams.article.dates) {
          lDate = aParams.article.dates[0];
        }
        return GDate.formatDate(lDate, "%JJ/%MM/%AA");
      }
    }
    return "";
  }
  getHintForce(aParams) {
    if (
      aParams.idColonne === DonneesListe_RessourcesPedagogiques.colonnes.date &&
      aParams.article.dates
    ) {
      if (!aParams.article.dates.trie) {
        aParams.article.dates.sort((a, b) => {
          return a.getTime() - b.getTime();
        });
        aParams.article.dates.trie = true;
      }
      let lLibelle = "";
      aParams.article.dates.forEach((aDate) => {
        if (lLibelle.length > 0) {
          lLibelle += "\n";
        }
        lLibelle += GDate.formatDate(aDate, "%JJ/%MM/%AA");
      });
      return lLibelle;
    }
    return "";
  }
  getTri(aColonne, aGenreTri) {
    const lTris = [];
    switch (this.getId(aColonne)) {
      case DonneesListe_RessourcesPedagogiques.colonnes.types:
        lTris.push(
          ObjetTri.init((D) => {
            return D.genres.count();
          }, aGenreTri),
        );
        lTris.push(ObjetTri.init("Genre", aGenreTri));
        break;
      case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
        lTris.push(
          ObjetTri.init((D) => {
            return D.ressource.QCM
              ? D.ressource.QCM.getLibelle()
              : D.ressource.getLibelle();
          }, aGenreTri),
        );
        break;
      case DonneesListe_RessourcesPedagogiques.colonnes.date:
        lTris.push(
          ObjetTri.init(
            "date",
            aGenreTri === EGenreTriElement.Decroissant
              ? EGenreTriElement.Croissant
              : EGenreTriElement.Decroissant,
          ),
        );
        break;
      case DonneesListe_RessourcesPedagogiques.colonnes.matiere:
        lTris.push(
          ObjetTri.init((D) => {
            return D.matiere.getLibelle();
          }, aGenreTri),
        );
        lTris.push(
          ObjetTri.init((D) => {
            return D.matiere.getNumero();
          }, aGenreTri),
        );
        break;
    }
    lTris.push(ObjetTri.init("Libelle", aGenreTri));
    lTris.push(ObjetTri.init("date", aGenreTri));
    return lTris;
  }
  getVisible(D) {
    return D.visible;
  }
}
DonneesListe_RessourcesPedagogiques.colonnes = {
  types: "Dl_RessPeda_types",
  libelle: "Dl_RessPeda_libelle",
  date: "Dl_RessPeda_date",
  matiere: "Dl_RessPeda_matiere",
};
module.exports = { DonneesListe_RessourcesPedagogiques };
